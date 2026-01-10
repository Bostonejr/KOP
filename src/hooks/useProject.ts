/**
 * useProject Hook - Fetch Single Project by Slug
 *
 * This hook fetches a complete project with all its details.
 * Used on the project detail page.
 *
 * Also fetches adjacent projects for "Previous" / "Next" navigation.
 *
 * Usage:
 *   // slug comes from URL: /portfolio/nana-peprahs-residence
 *   const { project, adjacentProjects, isLoading, error } = useProject(slug);
 */

import { useState, useEffect } from 'react';
import { sanityClient } from '../lib/sanity';
import { projectBySlugQuery, adjacentProjectsQuery } from '../lib/queries';
import type { Project, AdjacentProjects } from '../types/project';

interface UseProjectReturn {
  project: Project | null;              // The project data, or null if not found
  adjacentProjects: AdjacentProjects;   // Previous/Next for navigation
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch a single project and its neighbors
 *
 * @param slug - The URL-friendly project identifier (e.g., "nana-peprahs-residence")
 */
export function useProject(slug: string): UseProjectReturn {
  const [project, setProject] = useState<Project | null>(null);
  const [adjacentProjects, setAdjacentProjects] = useState<AdjacentProjects>({
    previous: null,
    next: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    /**
     * Fetch the project and its neighbors
     *
     * We run two queries:
     * 1. Get the main project by slug
     * 2. Get adjacent projects using the sortingNumber
     *
     * This could be optimized into a single query, but keeping them
     * separate makes the code more readable for learning.
     */
    const fetchProject = async () => {
      // Don't fetch if no slug provided
      if (!slug) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch the main project
        // { slug } passes the slug parameter to the GROQ query
        const projectData = await sanityClient.fetch(projectBySlugQuery, { slug });

        // Check if project was found
        if (!projectData) {
          throw new Error(`Project not found: ${slug}`);
        }

        setProject(projectData);

        // Now fetch adjacent projects using the current project's sortingNumber
        // This gives us "Previous" and "Next" for navigation
        const adjacent = await sanityClient.fetch(adjacentProjectsQuery, {
          currentSort: projectData.sortingNumber,
        });

        setAdjacentProjects(adjacent);

      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch project')
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [slug]); // Re-run when slug changes (user navigates to different project)

  return {
    project,
    adjacentProjects,
    isLoading,
    error,
  };
}

export default useProject;
