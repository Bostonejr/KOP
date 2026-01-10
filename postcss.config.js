/**
 * PostCSS Configuration
 *
 * PostCSS is a tool that transforms CSS with JavaScript plugins.
 * Think of it as Babel but for CSS - it processes your CSS files and can:
 * - Add vendor prefixes automatically (autoprefixer)
 * - Transform Tailwind directives into actual CSS
 *
 * Note: Tailwind CSS v4 uses a separate PostCSS package (@tailwindcss/postcss)
 */

export default {
  plugins: {
    // Tailwind CSS v4 - PostCSS plugin
    '@tailwindcss/postcss': {},

    // Autoprefixer - adds vendor prefixes for browser compatibility
    // Example: 'display: flex' becomes 'display: -webkit-flex; display: flex'
    autoprefixer: {},
  },
};
