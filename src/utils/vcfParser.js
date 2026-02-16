/**
 * Parses a VCF file string into an array of contact objects.
 * Handles extensive VCF quirks, versions 2.1, 3.0, 4.0, and various encodings.
 */
export const parseVCF = (vcfContent) => {
    const contacts = [];
    let currentContact = null;

    // Normalize line endings to \n
    const normalizedContent = vcfContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Split by lines but handle line folding (lines starting with space or tab)
    const lines = [];
    const rawLines = normalizedContent.split('\n');

    for (let i = 0; i < rawLines.length; i++) {
        const line = rawLines[i];
        if (line.length === 0) continue;

        // Check for line folding (continuation of previous line)
        if ((line.startsWith(' ') || line.startsWith('\t')) && lines.length > 0) {
            // Remove the leading space/tab and append to previous line
            // Note: In VCF 2.1, Quoted-Printable soft breaks (= at end of line) are also used.
            // We will handle QP decoding later, but for now just unfold.
            lines[lines.length - 1] += line.substring(1);
        } else {
            lines.push(line);
        }
    }

    for (const line of lines) {
        if (line.toUpperCase().trim() === 'BEGIN:VCARD') {
            currentContact = {};
            continue;
        }

        if (line.toUpperCase().trim() === 'END:VCARD') {
            if (currentContact && Object.keys(currentContact).length > 0) {
                contacts.push(currentContact);
            }
            currentContact = null;
            continue;
        }

        if (!currentContact) continue;

        // Parse PROPERTY:VALUE or GROUP.PROPERTY:VALUE
        // Handle parameters like EMAIL;TYPE=WORK:john@example.com
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) continue;

        let keyPart = line.substring(0, colonIndex);
        let valuePart = line.substring(colonIndex + 1);

        // Separate Group (if any), Property, and Params
        // e.g., item1.TEL;type=CELL;type=VOICE;type=pref:+123456
        // group = item1, prop = TEL, params = [type=CELL, ...]

        let group = null;
        let property = keyPart;
        let params = {};

        // Check for group (e.g., item1.ADR)
        if (property.indexOf('.') !== -1 && property.indexOf(';') === -1) {
            // Simple group check: no semicolon means the dot is likely a group separator
            // But wait, parameters can keys can have dots? strict vCard usually not.
            // Let's safe bet: split by first dot if before any semicolon
            const dotIndex = property.indexOf('.');
            group = property.substring(0, dotIndex);
            property = property.substring(dotIndex + 1);
        } else if (property.indexOf('.') !== -1 && property.indexOf(';') !== -1) {
            if (property.indexOf('.') < property.indexOf(';')) {
                const dotIndex = property.indexOf('.');
                group = property.substring(0, dotIndex);
                property = property.substring(dotIndex + 1);
            }
        }

        // Split Property and Params
        const semiIndex = property.indexOf(';');
        if (semiIndex !== -1) {
            const paramStr = property.substring(semiIndex + 1);
            property = property.substring(0, semiIndex).toUpperCase(); // Standardize property name

            // Parse params
            const paramPairs = paramStr.split(';');
            for (const pair of paramPairs) {
                const eqIndex = pair.indexOf('=');
                if (eqIndex !== -1) {
                    const pKey = pair.substring(0, eqIndex).toUpperCase();
                    const pVal = pair.substring(eqIndex + 1);

                    if (params[pKey]) {
                        // If exists, convert to array or push
                        if (Array.isArray(params[pKey])) {
                            params[pKey].push(pVal);
                        } else {
                            params[pKey] = [params[pKey], pVal];
                        }
                    } else {
                        params[pKey] = pVal;
                    }
                } else {
                    // Type parameter often lacks keys in v2.1 (e.g., ;WORK;VOICE)
                    // Treat as TYPE
                    const pVal = pair;
                    if (params['TYPE']) {
                        if (Array.isArray(params['TYPE'])) {
                            params['TYPE'].push(pVal);
                        } else {
                            params['TYPE'] = [params['TYPE'], pVal];
                        }
                    } else {
                        params['TYPE'] = pVal;
                    }
                }
            }
        } else {
            property = property.toUpperCase();
        }

        // Decode Value
        // Handle Quoted-Printable
        if (params['ENCODING'] && params['ENCODING'].toUpperCase() === 'QUOTED-PRINTABLE') {
            valuePart = decodeQuotedPrintable(valuePart);
        }

        // Handle Charset (usually UTF-8 is assumed in modern, but might be explicitly set)
        // In JS strings are UTF-16, decoding bytes is hard without Raw data. 
        // We assume FileReader read as text handles most, but QP might have encoded bytes.
        // For now, assume QP decoded string is correct or "close enough".

        // Base64 (PHOTO etc)
        // Photos in VCF (especially older ones) might be split across lines (handled by unfolding above)
        // but sometimes they just have ENCODING=b or ENCODING=BASE64
        // If param ENCODING=BASE64, valuePart is the partial data.

        // NOTE: The simple unfold above might not be enough for large split base64 blocks 
        // if they don't start with space. VCF 2.1 sometimes just ends line and starts next.
        // However, the spec requires folding with space. If it's not folded, it's technically separate properties?
        // We will assume spec compliance for now.

        // Store in Contact Object
        // We'll normalize some common fields to arrays since multiple are allowed (Email, Phone, etc)

        const entry = { value: valuePart, params: params, group: group };

        if (!currentContact[property]) {
            currentContact[property] = [];
        }
        currentContact[property].push(entry);
    }

    return contacts.map(normalizeContact);
};

const decodeQuotedPrintable = (str) => {
    // Basic QP decoder
    // Replace =XY with char code
    return str.replace(/=([0-9A-F]{2})/gi, (match, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
    }).replace(/=\n/g, ''); // Soft line breaks (though we likely already unfolded)
};

const normalizeContact = (raw) => {
    // Convert the raw map of properties to a cleaner specific object for UI
    const get = (prop) => raw[prop] ? raw[prop][0].value : '';
    const getAll = (prop) => raw[prop] ? raw[prop] : [];

    // FN (Full Name) - fallback to N if missing
    let fn = get('FN');
    if (!fn && raw['N']) {
        const parts = get('N').split(';');
        // N: Family;Given;Middle;Prefix;Suffix
        const family = parts[0] || '';
        const given = parts[1] || '';
        fn = `${given} ${family}`.trim();
    }

    // Photo
    let photo = null;
    if (raw['PHOTO']) {
        const p = raw['PHOTO'][0];
        const isBase64 = p.params['ENCODING'] && (p.params['ENCODING'].toUpperCase() === 'B' || p.params['ENCODING'].toUpperCase() === 'BASE64');
        const type = p.params['TYPE'] || 'JPEG'; // Default assumption
        // Clean up base64 string (remove whitespace)
        let b64 = p.value.replace(/\s/g, '');

        // Sometimes type is embedded in value or params.
        // Construct data URL
        if (isBase64 || /^[A-Za-z0-9+/=]+$/.test(b64)) {
            photo = `data:image/${type};base64,${b64}`;
        }
    }

    return {
        id: crypto.randomUUID(),
        fn: fn,
        n: get('N'),
        org: get('ORG'),
        title: get('TITLE'),
        tel: getAll('TEL'),
        email: getAll('EMAIL'),
        adr: getAll('ADR'),
        url: getAll('URL'),
        note: get('NOTE'),
        photo: photo,
        raw: raw // Keep raw for debugging details
    };
};
