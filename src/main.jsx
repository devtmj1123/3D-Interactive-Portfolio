/**
 * Galaxy Portfolio — Entry Point
 *
 * Initializes the React application with:
 * - Strict mode for development warnings
 * - Performance monitoring (optional)
 * - Root element mounting
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Ensure index.html has a div with id="root"');
}

// Create root and render
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Performance monitoring (development only)
if (import.meta.env.DEV) {
  // Log performance metrics
  window.addEventListener('load', () => {
    if (window.performance) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      console.log(`⚡ Page loaded in ${loadTime}ms`);
    }
  });
}
