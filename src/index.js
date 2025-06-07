import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/styles'; 
import App from './components/App';
import reportWebVitals from './reportWebVitals';

// Asegurate de que este elemento exista en tu index.html
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();