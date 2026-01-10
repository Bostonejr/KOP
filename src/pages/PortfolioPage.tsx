/**
 * PortfolioPage - Project Gallery with Filtering
 *
 * Displays all projects in a grid layout with category filtering.
 *
 * Structure:
 * - Header (solid dark background)
 * - "PROJECTS" title + Category filter dropdown
 * - Grid of project cards
 * - Footer
 *
 * Features:
 * - Filter by category (Residential, Social, Recreational, Religious)
 * - Loading skeleton while fetching
 * - Empty state when no projects match filter
 *
 * State Management:
 * - selectedCategory: Currently selected filter ('All' or specific category)
 * - useProjects hook handles data fetching with category parameter
 */

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Header, Footer } from '../components/common';
import { CategoryFilter, ProjectGrid } from '../components/portfolio';
import { useProjects } from '../hooks';
import type { ProjectCategory, CategoryFilter as CategoryFilterType } from '../types/project';

const PortfolioPage: React.FC = () => {
  // State for the selected category filter
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilterType>('All');

  // Fetch projects with the selected category filter
  // When selectedCategory changes, the hook refetches with the new filter
  const { projects, isLoading, error } = useProjects(selectedCategory);

  // Available categories for the filter dropdown
  const categories: ProjectCategory[] = [
    'Residential',
    'Social',
    'Recreational',
    'Religious',
  ];

  return (
    <>
      {/* SEO meta tags */}
      <Helmet>
        <title>Portfolio | Kwabena Oppong-Peprah</title>
        <meta
          name="description"
          content="Browse architectural projects by Kwabena Oppong-Peprah. Filter by category: Residential, Social, Recreational, Religious."
        />
      </Helmet>

      {/* Header with solid background (not transparent) */}
      <Header variant="solid" />

      {/* Main content */}
      <main className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">

          {/* Page header: Title and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="
              flex flex-col md:flex-row
              md:items-center md:justify-between
              gap-6 mb-12
            "
          >
            {/* Page title */}
            <h1 className="font-serif text-4xl md:text-5xl text-charcoal">
              PROJECTS
            </h1>

            {/* Category filter dropdown */}
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </motion.div>

          {/* Projects grid with loading/error/empty states */}
          {isLoading ? (
            // Loading skeleton
            // Shows placeholder boxes while data is loading
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  {/* Image placeholder */}
                  <div className="bg-light-gray aspect-[3/2] mb-4" />
                  {/* Title placeholder */}
                  <div className="bg-light-gray h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : error ? (
            // Error state
            <p className="text-center text-charcoal/50 py-12 font-sans">
              Failed to load projects. Please try again.
            </p>
          ) : projects.length === 0 ? (
            // Empty state (no projects match filter)
            <p className="text-center text-charcoal/50 py-12 font-sans">
              No projects found in this category.
            </p>
          ) : (
            // Success: show the project grid
            <ProjectGrid projects={projects} />
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PortfolioPage;
