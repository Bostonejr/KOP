/**
 * ProjectCard Component - Portfolio Grid Item
 *
 * Displays a single project in the portfolio grid.
 * Shows the main project image with the project name below.
 *
 * Interactions:
 * - Entire card is clickable (links to project detail page)
 * - Image scales up slightly on hover
 * - Project name changes to gold on hover
 * - Fade-in animation when card appears
 *
 * This component demonstrates:
 * - Link wrapping for the entire card
 * - CSS transform animations
 * - Staggered animations with index-based delay
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Project } from '../../types/project';
import { imagePresets } from '../../lib/sanityImage';
import { LazyImage } from '../common';

interface ProjectCardProps {
  project: Project;  // Project data from Sanity
  index: number;     // Position in grid (for staggered animation)
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  return (
    <motion.article
      // Staggered fade-in animation
      // Each card appears slightly after the previous one
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,  // 0ms, 100ms, 200ms, etc.
        ease: [0.25, 0.1, 0.25, 1],  // Custom easing
      }}
    >
      <Link
        to={`/portfolio/${project.slug}`}
        className="group block"  // 'group' enables group-hover on children
      >
        {/* Project image container */}
        <div className="overflow-hidden mb-4">
          {/*
            Inner div handles the scale transform.

            Why separate containers?
            - Outer div has overflow:hidden to clip the scaled image
            - Inner div scales up on hover
            - This creates a "zoom in place" effect
          */}
          <div className="
            transform transition-transform duration-500
            group-hover:scale-105
          ">
            <LazyImage
              src={imagePresets.thumbnail(project.mainImage)}
              placeholderSrc={imagePresets.placeholder(project.mainImage)}
              alt={project.mainImage.alt || project.name}
              aspectRatio="aspect-[3/2]"  // 3:2 aspect ratio like photos
              className="w-full"
            />
          </div>
        </div>

        {/* Project name */}
        <h3 className="
          font-sans text-sm md:text-base text-charcoal
          group-hover:text-gold
          transition-colors duration-300
        ">
          {project.name}
        </h3>
      </Link>
    </motion.article>
  );
};

export default ProjectCard;
