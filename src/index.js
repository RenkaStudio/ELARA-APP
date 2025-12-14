import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { initializePDFJS } from './config/pdfConfig'; // Import PDF.js initialization

// Initialize PDF.js when the app starts
initializePDFJS();

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);