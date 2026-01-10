/**
 * useProjects Hook - Fetch All Projects
 *
 * Custom hooks are reusable pieces of logic that use React hooks.
 * This hook handles fetching projects from Sanity with:
 * - Loading state (show spinner while fetching)
 * - Error state (show error message if fetch fails)
 * - Category filtering (optional)
 *
 * Why use a custom hook instead of fetching in the component?
 * 1. Separation of concerns - component focuses on UI, hook handles data
 * 2. Reusability - same hook can be used in multiple components
 * 3. Testability - easier to test data logic separately
 *
 * Usage:
 *   const { projects, isLoading, error } = useProjects();
 *   // or with category filter:
 *   const { projects } = useProjects('Residential');
 */

import { useState, useEffect, useCallback } from 'react';
import { sanityClient } from '../lib/sanity';
import { projectsQuery, projectsByCategoryQuery } from '../lib/queries';
import type { Project, CategoryFilter } from '../types/project';

/**
 * Return type for the hook
 * TypeScript interface ensures we always return the same shape
 */
interface UseProjectsReturn {
  projects: Project[];        // Array of projects (empty if loading/error)
  isLoading: boolean;         // True while fetching
  error: Error | null;        // Error object if fetch failed
  refetch: () => void;        // Function to manually refetch
}

/**
 * Hook to fetch projects with optional category filtering
 *
 * @param category - Optional category to filter by ('All' or specific category)
 * @returns Object with projects array, loading state, error, and refetch function
 *
 * React hooks used:
 * - useState: Store local state (projects, loading, error)
 * - useEffect: Run side effects (fetch data when component mounts or category changes)
 * - useCallback: Memoize the fetch function (prevent unnecessary re-renders)
 */
export function useProjects(category?: CategoryFilter): UseProjectsReturn {
  // State to store the fetched projects
  const [projects, setProjects] = useState<Project[]>([]);

  // Loading state - true while we're waiting for data
  const [isLoading, setIsLoading] = useState(true);

  // Error state - stores any errors that occur during fetch
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch function wrapped in useCallback
   *
   * useCallback memoizes the function so it doesn't change on every render.
   * This is important because we use it as a dependency in useEffect.
   *
   * Without useCallback, the function would be recreated every render,
   * causing useEffect to run infinitely.
   */
  const fetchProjects = useCallback(async () => {
    // Start loading
    setIsLoading(true);
    setError(null);

    try {
      let data: Project[];

      // Decide which query to use based on category
      if (!category || category === 'All') {
        // No category filter - fetch all projects
        data = await sanityClient.fetch(projectsQuery);
      } else {
        // Category specified - fetch filtered projects
        // The { category } passes the parameter to the GROQ query
        data = await sanityClient.fetch(projectsByCategoryQuery, { category });
      }

      // Success! Store the projects
      setProjects(data);
    } catch (err) {
      // Something went wrong - store the error
      // The instanceof check gives us a proper Error object
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to fetch projects')
      );
    } finally {
      // Always stop loading, whether success or error
      setIsLoading(false);
    }
  }, [category]); // Re-create function only when category changes

  /**
   * useEffect runs the fetch when:
   * 1. Component first mounts
   * 2. fetchProjects function changes (which happens when category changes)
   *
   * The dependency array [fetchProjects] tells React when to re-run.
   */
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Return the state and refetch function
  return {
    projects,
    isLoading,
    error,
    refetch: fetchProjects,
  };
}

export default useProjects;
