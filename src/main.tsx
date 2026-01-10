/**
 * Application Entry Point
 *
 * This is where React "mounts" to the DOM. It's the bridge between
 * our React code and the HTML page.
 *
 * Key concepts:
 * - StrictMode: Enables extra development checks (double-renders components
 *   to find bugs, warns about deprecated patterns). Only active in dev mode.
 * - createRoot: React 18+ API for rendering. The "root" is the top-level
 *   container where all our React components live.
 *
 * The flow:
 * 1. Browser loads index.html
 * 2. Browser executes this file (main.tsx)
 * 3. React takes over the <div id="root"> element
 * 4. Our App component renders inside it
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Import global styles (Tailwind CSS)
import './index.css';

// Import main App component
import App from './App';

// Find the root element in index.html
const rootElement = document.getElementById('root');

// Safety check - this should never fail, but TypeScript likes us to be sure
if (!rootElement) {
  throw new Error(
    'Root element not found. Make sure index.html has a <div id="root"></div>'
  );
}

// Create the React root and render our app
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
