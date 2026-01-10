/**
 * Sanity Studio Configuration
 *
 * This file configures Sanity Studio - the admin interface where you'll
 * manage your portfolio content (projects, images, settings).
 *
 * To use this:
 * 1. Create a Sanity account at https://sanity.io
 * 2. Create a new project in the Sanity dashboard
 * 3. Replace 'your-project-id' below with your actual project ID
 * 4. Run 'npm run dev' in the sanity folder to start the studio
 */

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas/index';

export default defineConfig({
  // Project name shown in the Studio
  name: 'kop-portfolio',
  title: 'KOP Portfolio Studio',

  // Your Sanity project ID - get this from sanity.io/manage
  // IMPORTANT: Replace with your actual project ID after creating a project
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id',

  // Dataset name - 'production' is the default
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  // Plugins extend the Studio's functionality
  plugins: [
    // Structure tool - the main content editing interface
    structureTool(),

    // Vision tool - lets you test GROQ queries in the Studio
    // Very helpful for debugging and learning GROQ
    visionTool(),
  ],

  // Schema types define the structure of your content
  schema: {
    types: schemaTypes,
  },
});
