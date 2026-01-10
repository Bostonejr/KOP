/**
 * Sanity CLI Configuration
 *
 * This file is used by the Sanity CLI for commands like:
 * - sanity dev (start local studio)
 * - sanity build (build for deployment)
 * - sanity deploy (deploy to Sanity hosting)
 */

import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
});
