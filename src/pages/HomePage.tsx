/**
 * HomePage - Landing Page with Hero Carousel
 *
 * The first page users see when visiting the site.
 * Features a full-screen image carousel of featured projects.
 *
 * Structure:
 * - Header (transparent, overlaying the carousel)
 * - HeroCarousel (full screen)
 * - Footer (below the carousel)
 *
 * Data Flow:
 * 1. useFeaturedProjects hook fetches featured projects from Sanity
 * 2. Projects are passed to HeroCarousel component
 * 3. Loading/error states are handled
 *
 * SEO:
 * - Uses Helmet to set page title and meta description
 * - These are important for search engine ranking
 */

import { Helmet } from 'react-helmet-async';
import { Header, Footer } from '../components/common';
import { HeroCarousel } from '../components/home';
import { useFeaturedProjects } from '../hooks';

const HomePage: React.FC = () => {
  // Fetch featured projects from Sanity CMS
  const { projects, isLoading, error } = useFeaturedProjects();

  // Loading state: show a simple loading screen
  // In production, you might use a skeleton or spinner
  if (isLoading) {
    return (
      <div className="h-screen bg-charcoal flex items-center justify-center">
        <div className="text-white font-sans animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  // Error state or no projects: show a fallback message
  if (error || projects.length === 0) {
    return (
      <div className="h-screen bg-charcoal flex items-center justify-center">
        <p className="text-white/70 font-sans">
          Unable to load projects. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      {/*
        Helmet manages the document head (<head>)

        This is important for SEO - search engines read these tags to
        understand what the page is about.

        Note: The HelmetProvider in App.tsx is required for this to work.
      */}
      <Helmet>
        <title>Kwabena Oppong-Peprah | Architecture Portfolio</title>
        <meta
          name="description"
          content="Explore the architectural portfolio of Kwabena Oppong-Peprah, featuring residential, social, recreational, and religious projects in Ghana."
        />
        {/* Open Graph tags for social media sharing */}
        <meta property="og:title" content="Kwabena Oppong-Peprah | Architecture Portfolio" />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="Explore the architectural portfolio of Kwabena Oppong-Peprah, featuring residential, social, recreational, and religious projects in Ghana."
        />
      </Helmet>

      {/*
        Header with transparent variant

        On the homepage, the header overlays the hero carousel,
        so we use 'transparent' to not block the image.
        It will become semi-opaque when scrolled.
      */}
      <Header variant="transparent" />

      {/* Main content - the hero carousel */}
      <main>
        <HeroCarousel projects={projects} />
      </main>

      {/* Footer below the carousel */}
      <Footer />
    </>
  );
};

export default HomePage;
