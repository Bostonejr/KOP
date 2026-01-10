/**
 * Vite Environment Type Declarations
 *
 * This file tells TypeScript about Vite's special features:
 * 1. Environment variables (import.meta.env.VITE_*)
 * 2. Asset imports (importing images, SVGs, etc.)
 *
 * The triple-slash directive references Vite's built-in types.
 */

/// <reference types="vite/client" />

/**
 * Extend Vite's ImportMetaEnv to include our custom environment variables.
 *
 * Environment variables in Vite:
 * - Must start with VITE_ to be exposed to the client
 * - Are accessed via import.meta.env.VITE_*
 * - Are replaced at build time (not runtime)
 *
 * Example usage:
 * const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
 */
interface ImportMetaEnv {
  // Sanity CMS configuration
  readonly VITE_SANITY_PROJECT_ID: string;
  readonly VITE_SANITY_DATASET: string;

  // Site configuration
  readonly VITE_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
