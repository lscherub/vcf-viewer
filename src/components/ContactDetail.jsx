import React from 'react';

const ContactDetail = ({ contact, onBack }) => {
    if (!contact) return null;

    const renderField = (label, value) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return null;

        return (
            <div style={{ marginBottom: '1.5rem' }}>
                <h4 className="text-label-large" style={{ color: 'var(--md-sys-color-primary)', marginBottom: '0.25rem' }}>
                    {label}
                </h4>
                {Array.isArray(value) ? (
                    value.map((v, i) => (
                        <div key={i} className="text-body-large" style={{ marginBottom: '0.25rem' }}>
                            {typeof v === 'string' ? v : v.value}
                            {v.params && v.params.TYPE && (
                                <span style={{
                                    fontSize: '0.8em',
                                    color: 'var(--md-sys-color-outline)',
                                    marginLeft: '0.5rem',
                                    textTransform: 'capitalize'
                                }}>
                                    {Array.isArray(v.params.TYPE) ? v.params.TYPE.join(', ') : v.params.TYPE}
                                </span>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-body-large">{value}</p>
                )}
            </div>
        );
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            <button
                className="btn-secondary"
                onClick={onBack}
                style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                ← Back to List
            </button>

            <div className="surface-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                    {contact.photo ? (
                        <img
                            src={contact.photo}
                            alt={contact.fn}
                            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }}
                        />
                    ) : (
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--md-sys-color-primary-container)',
                            color: 'var(--md-sys-color-on-primary-container)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '48px',
                            fontWeight: 'bold',
                            marginBottom: '1rem'
                        }}>
                            {contact.fn ? contact.fn.charAt(0).toUpperCase() : '?'}
                        </div>
                    )}
                    <h2 className="text-headline-medium" style={{ textAlign: 'center' }}>
                        {contact.fn || 'Unnamed Contact'}
                    </h2>
                    {contact.org && (
                        <p className="text-title-medium" style={{ color: 'var(--md-sys-color-outline)' }}>
                            {contact.org} {contact.title ? `• ${contact.title}` : ''}
                        </p>
                    )}
                </div>

                <div>
                    {renderField('Phone', contact.tel)}
                    {renderField('Email', contact.email)}
                    {renderField('Address', contact.adr)}
                    {renderField('Website', contact.url)}
                    {renderField('Notes', contact.note)}
                </div>
            </div>
        </div>
    );
};

export default ContactDetail;
