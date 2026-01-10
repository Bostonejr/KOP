/**
 * Main Application Component
 *
 * This is the root component that:
 * 1. Sets up routing (which page to show based on URL)
 * 2. Wraps everything in necessary providers (SEO, etc.)
 * 3. Defines the page layout structure
 *
 * React Router Concepts:
 * - BrowserRouter: Uses browser's history API for clean URLs (/portfolio not /#/portfolio)
 * - Routes: Container for all our route definitions
 * - Route: Maps a URL path to a component
 *
 * Provider Pattern:
 * Providers wrap the app to share data/functionality across all components.
 * - HelmetProvider: Lets any component update the page's <head> (title, meta tags)
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Page components (we'll create these next)
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import ProjectPage from './pages/ProjectPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    // HelmetProvider enables SEO meta tag management from any component
    <HelmetProvider>
      {/* BrowserRouter enables client-side routing */}
      <BrowserRouter>
        {/*
          Routes is like a switch statement for URLs:
          - If URL is "/", render HomePage
          - If URL is "/portfolio", render PortfolioPage
          - etc.

          The order matters for some cases (more specific routes first).
        */}
        <Routes>
          {/* Home page - the landing page with hero carousel */}
          <Route path="/" element={<HomePage />} />

          {/* Portfolio page - grid of all projects */}
          <Route path="/portfolio" element={<PortfolioPage />} />

          {/*
            Individual project page
            :slug is a URL parameter - it captures whatever comes after /portfolio/
            Example: /portfolio/nana-peprahs-residence -> slug = "nana-peprahs-residence"
          */}
          <Route path="/portfolio/:slug" element={<ProjectPage />} />

          {/* Contact page - form and info */}
          <Route path="/contact" element={<ContactPage />} />

          {/*
            Catch-all route for 404s
            * matches any URL not caught above
            We redirect to portfolio instead of showing a 404 page
          */}
          <Route path="*" element={<PortfolioPage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
