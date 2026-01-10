/**
 * useFeaturedProjects Hook - Fetch Homepage Carousel Projects
 *
 * This hook fetches only the projects marked as "featured" in Sanity.
 * These are displayed in the homepage hero carousel.
 *
 * Simpler than useProjects because:
 * - No filtering needed (query handles it)
 * - No parameters
 * - Returns FeaturedProject type (less data)
 *
 * Usage:
 *   const { projects, isLoading, error } = useFeaturedProjects();
 */

import { useState, useEffect } from 'react';
import { sanityClient } from '../lib/sanity';
import { featuredProjectsQuery } from '../lib/queries';
import type { FeaturedProject } from '../types/project';

interface UseFeaturedProjectsReturn {
  projects: FeaturedProject[];
  isLoading: boolean;
  error: Error | null;
}

export function useFeaturedProjects(): UseFeaturedProjectsReturn {
  const [projects, setProjects] = useState<FeaturedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    /**
     * Async function defined inside useEffect
     *
     * We can't make useEffect itself async (React doesn't allow it),
     * so we define an async function inside and call it immediately.
     */
    const fetchFeatured = async () => {
      try {
        const data = await sanityClient.fetch(featuredProjectsQuery);
        setProjects(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch featured projects')
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Call the async function
    fetchFeatured();
  }, []); // Empty dependency array = run once on mount

  return { projects, isLoading, error };
}

export default useFeaturedProjects;
