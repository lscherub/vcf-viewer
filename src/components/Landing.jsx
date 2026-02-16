import React, { useCallback } from 'react';

const Landing = ({ onFileUpload }) => {
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            if (files[0].name.toLowerCase().endsWith('.vcf')) {
                onFileUpload(files[0]);
            } else {
                alert("Please upload a .vcf file.");
            }
        }
    }, [onFileUpload]);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileUpload(e.target.files[0]);
        }
    };

    return (
        <div
            className="landing-container"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '80vh',
                textAlign: 'center',
                padding: '2rem',
                border: '2px dashed var(--md-sys-color-outline)',
                borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                backgroundColor: 'var(--md-sys-color-surface)',
                margin: '2rem'
            }}
        >
            <h1 className="text-display-large" style={{ color: 'var(--md-sys-color-primary)', marginBottom: '1rem' }}>
                VCF Viewer
            </h1>
            <p className="text-body-large" style={{ maxWidth: '600px', marginBottom: '2rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                A secure, private way to view your contacts.
                Files are processed locally in your browser and never sent to any server.
            </p>

            <div style={{ marginBottom: '2rem' }}>
                <button
                    className="btn-primary"
                    onClick={() => document.getElementById('fileInput').click()}
                >
                    Select VCF File
                </button>
                <input
                    type="file"
                    id="fileInput"
                    accept=".vcf"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
            </div>

            <p className="text-label-large" style={{ color: 'var(--md-sys-color-outline)' }}>
                or drag and drop here
            </p>
        </div>
    );
};

export default Landing;
