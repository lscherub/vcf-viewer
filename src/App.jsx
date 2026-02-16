import React, { useState } from 'react';
import Landing from './components/Landing';
import ContactList from './components/ContactList';
import ContactDetail from './components/ContactDetail';
import { parseVCF } from './utils/vcfParser';

function App() {
  const [view, setView] = useState('landing'); // 'landing', 'list', 'detail'
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (file) => {
    setIsLoading(true);
    setError(null);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const parsedContacts = parseVCF(content);

        if (parsedContacts.length === 0) {
          setError("No contacts found in this file.");
          setIsLoading(false);
          return;
        }

        // Sort by name
        parsedContacts.sort((a, b) => (a.fn || '').localeCompare(b.fn || ''));

        setContacts(parsedContacts);
        setView('list');
      } catch (err) {
        console.error("Parsing error:", err);
        setError("Failed to parse VCF file. It might be malformed.");
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read file.");
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setView('detail');
  };

  const handleBackToList = () => {
    setSelectedContact(null);
    setView('list');
  };

  const handleReset = () => {
    setContacts([]);
    setSelectedContact(null);
    setView('landing');
    setError(null);
  };

  return (
    <div className="App" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--md-sys-color-surface)',
        borderBottom: view !== 'landing' ? '1px solid var(--md-sys-color-outline)' : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={handleReset}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: 'var(--md-sys-color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>V</div>
          <span className="text-title-medium" style={{ color: 'var(--md-sys-color-on-surface)' }}>VCF Viewer</span>
        </div>

        {view !== 'landing' && (
          <button className="btn-icon" onClick={handleReset} title="Upload new file">
            <span style={{ fontSize: '24px' }}>⟳</span>
          </button>
        )}
      </header>

      <main style={{ flex: 1, overflow: 'hidden', maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '1rem' }}>
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <p className="text-body-large">Processing...</p>
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: 'var(--md-sys-color-error-container)',
            color: 'var(--md-sys-color-on-error-container)',
            padding: '1rem',
            borderRadius: 'var(--md-sys-shape-corner-medium)',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
            <button
              style={{ marginLeft: '1rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {view === 'landing' && <Landing onFileUpload={handleFileUpload} />}
            {view === 'list' && <ContactList contacts={contacts} onSelectContact={handleSelectContact} />}
            {view === 'detail' && <ContactDetail contact={selectedContact} onBack={handleBackToList} />}
          </>
        )}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '1rem',
        fontSize: '12px',
        color: 'var(--md-sys-color-on-surface-variant)',
        borderTop: '1px solid var(--md-sys-color-outline)'
      }}>
        Privacy First: No data is uploaded. Running locally.
      </footer>
    </div>
  );
}

export default App;
