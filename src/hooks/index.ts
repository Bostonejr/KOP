/**
 * Hooks Index - Central Export Point
 *
 * This file re-exports all custom hooks from a single location.
 * Makes imports cleaner:
 *
 * Instead of:
 *   import { useProjects } from '../hooks/useProjects';
 *   import { useProject } from '../hooks/useProject';
 *
 * You can write:
 *   import { useProjects, useProject } from '../hooks';
 *
 * This is called the "barrel pattern" - common in React projects.
 */

export { useProjects } from './useProjects';
export { useFeaturedProjects } from './useFeaturedProjects';
export { useProject } from './useProject';
