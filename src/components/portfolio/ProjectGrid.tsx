/**
 * ProjectGrid Component - Responsive Grid of Projects
 *
 * Displays projects in a responsive grid layout:
 * - 1 column on mobile
 * - 2 columns on tablet and desktop
 *
 * The grid uses CSS Grid for layout, which is perfect for
 * equal-sized items in rows and columns.
 *
 * Animation:
 * - Container fades in when it appears
 * - Individual cards have staggered fade-in (handled by ProjectCard)
 */

import { motion } from 'framer-motion';
import type { Project } from '../../types/project';
import ProjectCard from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];  // Array of projects to display
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects }) => {
  return (
    <motion.div
      // Fade in the entire grid container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="
        grid
        grid-cols-1      /* 1 column on mobile */
        md:grid-cols-2   /* 2 columns from 768px up */
        gap-8 md:gap-12  /* Space between items */
      "
    >
      {/*
        Map over projects to render cards

        The key prop is crucial for React's reconciliation algorithm.
        Using _id (from Sanity) ensures uniqueness.

        Index is passed for staggered animation timing.
      */}
      {projects.map((project, index) => (
        <ProjectCard
          key={project._id}
          project={project}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default ProjectGrid;
