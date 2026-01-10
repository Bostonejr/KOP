/**
 * Vite Configuration
 *
 * Vite is our build tool - it's much faster than Create React App because it uses
 * native ES modules in development (no bundling needed) and esbuild for production.
 *
 * This config tells Vite:
 * 1. We're using React (via the plugin)
 * 2. Where to look for source files
 * 3. How to resolve imports (like using '@/' as alias for 'src/')
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // Plugins extend Vite's functionality
  // The React plugin enables JSX transformation and Fast Refresh (hot reloading)
  plugins: [react()],

  // Resolve configuration for module imports
  resolve: {
    alias: {
      // This lets us use '@/components/Header' instead of '../../components/Header'
      // Much cleaner imports, especially in deeply nested files
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Development server configuration
  server: {
    port: 3000,        // Run on localhost:3000
    open: true,        // Auto-open browser when running 'npm run dev'
  },

  // Build configuration for production
  build: {
    outDir: 'dist',    // Output folder for 'npm run build'
    sourcemap: true,   // Generate source maps for debugging
  },
});
