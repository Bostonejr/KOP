/**
 * ProjectNavigation Component - Previous/Next Links
 *
 * Displays navigation buttons to adjacent projects.
 * Appears at the bottom of the project detail page.
 *
 * Features:
 * - Previous button (left) - links to project with lower sortingNumber
 * - Next button (right) - links to project with higher sortingNumber
 * - Buttons only show if adjacent project exists
 * - Hover effect: dark background, white text
 */

import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AdjacentProjects } from '../../types/project';

interface ProjectNavigationProps {
  adjacentProjects: AdjacentProjects;  // Previous and next project info
}

const ProjectNavigation: React.FC<ProjectNavigationProps> = ({
  adjacentProjects,
}) => {
  return (
    <div className="
      flex justify-between items-center
      py-8
      border-t border-charcoal/10
    ">
      {/* Previous project link */}
      {adjacentProjects.previous ? (
        <Link
          to={`/portfolio/${adjacentProjects.previous.slug}`}
          className="
            flex items-center gap-2
            px-4 py-2
            border border-charcoal/20
            text-charcoal font-sans text-sm
            hover:bg-charcoal hover:text-white hover:border-charcoal
            transition-all duration-300
          "
        >
          <ChevronLeft size={18} />
          <span>Previous</span>
        </Link>
      ) : (
        // Empty div to maintain spacing when no previous project
        <div />
      )}

      {/* Next project link */}
      {adjacentProjects.next ? (
        <Link
          to={`/portfolio/${adjacentProjects.next.slug}`}
          className="
            flex items-center gap-2
            px-4 py-2
            border border-charcoal/20
            text-charcoal font-sans text-sm
            hover:bg-charcoal hover:text-white hover:border-charcoal
            transition-all duration-300
          "
        >
          <span>Next</span>
          <ChevronRight size={18} />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
};

export default ProjectNavigation;
