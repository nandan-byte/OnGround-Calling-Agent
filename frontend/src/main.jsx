// Import standard React library
import React from 'react';
// Import ReactDOM client for React 18 createRoot
import ReactDOM from 'react-dom/client';
// Import the root App component
import App from './App.jsx';
// Import global stylesheets
import './index.css';

// Mount React application into the root DOM element
ReactDOM.createRoot(document.getElementById('root')).render(
  // Enable React StrictMode during development
  <React.StrictMode>
    {/* Render root application */}
    <App />
  </React.StrictMode>,
);
