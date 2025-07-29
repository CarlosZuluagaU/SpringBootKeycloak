import React from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './services/keycloak.js';
import UserDashboard from './pages/UserDashboard.jsx';
import Header from './components/layout/Header.jsx';

function App() {
  return (
    <ReactKeycloakProvider authClient={keycloak}>
      <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
        <Header />
        <main className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem' }}>
          <UserDashboard />
        </main>
      </div>
    </ReactKeycloakProvider>
  );
}

export default App;
