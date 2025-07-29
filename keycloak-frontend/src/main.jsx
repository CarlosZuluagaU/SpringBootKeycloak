import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Importamos la fuente Inter para que esté disponible en toda la aplicación.
import "@fontsource/inter/400.css"; // Regular
import "@fontsource/inter/500.css"; // Medium
import "@fontsource/inter/600.css"; // Semi-bold
import "@fontsource/inter/700.css"; // Bold
import "@fontsource/inter/800.css"; // Extra-bold

ReactDOM.createRoot(document.getElementById('root')).render(
  // Hemos quitado <React.StrictMode> para evitar el error de doble 
  // inicialización de Keycloak que vimos en la consola.
  <App />
);
