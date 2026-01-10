/**
 * ProjectPage - Individual Project Detail
 *
 * Displays complete details for a single project.
 *
 * Structure:
 * - Header (solid)
 * - Project info section:
 *   - Left: Title + Description
 *   - Right: Metadata (Status, Location, Period)
 * - Hero image (full width)
 * - Image gallery
 * - Previous/Next navigation
 * - Footer
 *
 * Data Flow:
 * 1. Extract slug from URL params
 * 2. useProject hook fetches project data and adjacent projects
 * 3. Display loading/error states or project content
 *
 * SEO:
 * - Dynamic title and description based on project
 * - Open Graph tags for social sharing
 */

import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Header, Footer } from '../components/common';
import {
  ProjectHero,
  ProjectMetadata,
  ImageGallery,
  ProjectNavigation,
} from '../components/project';
import { useProject } from '../hooks';

const ProjectPage: React.FC = () => {
  // Get slug from URL parameter
  // URL: /portfolio/nana-peprahs-residence -> slug = "nana-peprahs-residence"
  const { slug } = useParams<{ slug: string }>();

  // Fetch project data and adjacent projects
  const { project, adjacentProjects, isLoading, error } = useProject(slug || '');

  // Loading state
  if (isLoading) {
    return (
      <>
        <Header variant="solid" />
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="animate-pulse text-charcoal font-sans">
            Loading project...
          </div>
        </div>
      </>
    );
  }

  // Error or not found state
  if (error || !project) {
    return (
      <>
        <Header variant="solid" />
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-center">
            <p className="text-charcoal/50 font-sans mb-4">
              Project not found
            </p>
            <a
              href="/portfolio"
              className="text-gold hover:text-gold-dark font-sans"
            >
              Back to Portfolio
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* Dynamic SEO meta tags */}
      <Helmet>
        <title>
          {project.seo?.metaTitle || project.name} | Kwabena Oppong-Peprah
        </title>
        <meta
          name="description"
          content={
            project.seo?.metaDescription ||
            project.description.substring(0, 160)
          }
        />
        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content={project.name} />
        <meta
          property="og:description"
          content={project.description.substring(0, 200)}
        />
        <meta property="og:type" content="article" />
      </Helmet>

      <Header variant="solid" />

      <main className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">

          {/* Project header section: Title + Description + Metadata */}
          <div className="
            grid grid-cols-1 lg:grid-cols-3
            gap-8 lg:gap-16
            mb-12
          ">
            {/* Left column: Title and Description (2/3 width on desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <h1 className="
                font-serif text-2xl md:text-3xl lg:text-4xl text-charcoal
                mb-6
              ">
                {project.name}
              </h1>
              <p className="
                font-sans text-sm md:text-base text-charcoal/80
                leading-relaxed
              ">
                {project.description}
              </p>
            </motion.div>

            {/* Right column: Metadata sidebar (1/3 width on desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ProjectMetadata
                status={project.status}
                location={project.location}
                period={project.period}
              />
            </motion.div>
          </div>

          {/* Hero image */}
          <ProjectHero
            image={project.mainImage}
            projectName={project.name}
          />

          {/* Image gallery (if project has additional images) */}
          {project.projectImages && project.projectImages.length > 0 && (
            <div className="mb-12">
              <ImageGallery
                images={project.projectImages}
                projectName={project.name}
              />
            </div>
          )}

          {/* Previous/Next navigation */}
          <ProjectNavigation adjacentProjects={adjacentProjects} />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProjectPage;
