/**
 * Sanity CMS Client Configuration
 *
 * This file sets up our connection to Sanity's content API.
 *
 * Sanity is a "headless CMS" - it stores and manages your content (projects,
 * images, text) but doesn't handle how it's displayed. We fetch the content
 * via API and display it however we want in React.
 *
 * Think of it like this:
 * - WordPress = CMS + Website (coupled)
 * - Sanity = Just CMS (content only)
 * - React = Just Website (display only)
 * - Together = Decoupled architecture (more flexible)
 *
 * Benefits:
 * - Content editors use a nice admin UI (Sanity Studio)
 * - Developers have full control over the frontend
 * - Content can be reused across web, mobile, etc.
 */

import { createClient } from '@sanity/client';

/**
 * Create the Sanity client instance.
 *
 * Configuration options:
 * - projectId: Your Sanity project's unique ID (from sanity.io dashboard)
 * - dataset: Which dataset to use ('production' is typical)
 * - apiVersion: Date-based versioning ensures consistent API behavior
 * - useCdn: Use Sanity's CDN for faster reads (cached content)
 *
 * The environment variables are set in .env.local:
 * VITE_SANITY_PROJECT_ID=your-project-id
 * VITE_SANITY_DATASET=production
 */
export const sanityClient = createClient({
  // Project ID from Sanity dashboard (we'll set this up later)
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id',

  // Dataset name (usually 'production')
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',

  // API version - use today's date for latest features
  // Once set, don't change it to avoid breaking changes
  apiVersion: '2024-01-01',

  // Use CDN for faster responses (cached content)
  // Set to false if you need real-time updates
  useCdn: true,
});

/**
 * For development/preview, you might want a client without CDN
 * that shows unpublished content (drafts).
 *
 * Uncomment this if you add preview functionality:
 */
// export const previewClient = createClient({
//   projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
//   dataset: import.meta.env.VITE_SANITY_DATASET,
//   apiVersion: '2024-01-01',
//   useCdn: false,  // No CDN = fresh data
//   token: import.meta.env.VITE_SANITY_TOKEN,  // Needed for drafts
// });

export default sanityClient;
