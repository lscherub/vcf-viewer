import React, { useState, useMemo } from 'react';

const ContactList = ({ contacts, onSelectContact }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredContacts = useMemo(() => {
        return contacts.filter(c =>
            (c.fn && c.fn.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (c.email && c.email.some(e => typeof e === 'string' ? e.toLowerCase().includes(searchTerm.toLowerCase()) : e.value.toLowerCase().includes(searchTerm.toLowerCase())))
        );
    }, [contacts, searchTerm]);

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                backgroundColor: 'var(--md-sys-color-background)',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--md-sys-color-outline)'
            }}>
                <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '100px',
                        border: '1px solid var(--md-sys-color-outline)',
                        backgroundColor: 'var(--md-sys-color-surface-variant)',
                        color: 'var(--md-sys-color-on-surface-variant)',
                        fontSize: '16px'
                    }}
                />
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                <p className="text-label-large" style={{ marginBottom: '1rem', color: 'var(--md-sys-color-outline)' }}>
                    {filteredContacts.length} contacts found
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                    {filteredContacts.map(contact => (
                        <div
                            key={contact.id}
                            className="surface-card"
                            onClick={() => onSelectContact(contact)}
                            style={{
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}
                        >
                            {contact.photo ? (
                                <img
                                    src={contact.photo}
                                    alt={contact.fn}
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--md-sys-color-primary-container)',
                                    color: 'var(--md-sys-color-on-primary-container)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold'
                                }}>
                                    {contact.fn ? contact.fn.charAt(0).toUpperCase() : '?'}
                                </div>
                            )}
                            <div style={{ overflow: 'hidden' }}>
                                <h3 className="text-title-medium" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {contact.fn || 'Unnamed'}
                                </h3>
                                {contact.org && (
                                    <p className="text-label-large" style={{ color: 'var(--md-sys-color-outline)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {contact.org}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContactList;
