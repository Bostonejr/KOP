/**
 * Tailwind CSS Configuration
 *
 * This file customizes Tailwind to match our design system from the Figma mockups.
 * Instead of using Tailwind's default blue-500, gray-100, etc., we define our own
 * colors that match the architectural portfolio aesthetic.
 *
 * Key Design System Elements:
 * - Charcoal (#333333): Dark backgrounds, headers, footers
 * - Gold (#C9A96E): Accent color for hover states
 * - Light Gray (#E5E5E5): Form backgrounds, secondary surfaces
 * - White: Text on dark backgrounds, primary surfaces
 *
 * Typography:
 * - Headings: Playfair Display (elegant serif for architectural feel)
 * - Body: Inter (clean, readable sans-serif)
 */

/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind where to look for class names
  // It scans these files and only generates CSS for classes actually used
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      // ===========================================
      // COLORS - From Figma Design System
      // ===========================================
      colors: {
        // Primary dark color - used for header, footer, dark sections
        charcoal: {
          DEFAULT: '#333333',
          dark: '#2a2a2a',      // Slightly darker for depth
          light: '#4a4a4a',     // Lighter variant
        },

        // Accent color - used for hover states, highlights
        gold: {
          DEFAULT: '#C9A96E',
          dark: '#B8985D',      // Darker for active states
          light: '#D4B97D',     // Lighter variant
        },

        // Neutral backgrounds
        'light-gray': '#E5E5E5',

        // Keeping these for common use
        white: '#FFFFFF',
        black: '#000000',
      },

      // ===========================================
      // TYPOGRAPHY - Font Families
      // ===========================================
      fontFamily: {
        // Serif font for headings - elegant, architectural feel
        // We'll load this from Google Fonts in index.html
        serif: ['Playfair Display', 'Georgia', 'Cambria', 'serif'],

        // Sans-serif for body text - clean and readable
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },

      // ===========================================
      // SPACING & SIZING
      // ===========================================
      // Custom max-widths for content containers
      maxWidth: {
        '8xl': '88rem',  // 1408px - wider container for portfolio
      },

      // ===========================================
      // ANIMATIONS - For smooth interactions
      // ===========================================
      animation: {
        // Fade in from transparent
        'fade-in': 'fadeIn 0.6s ease-out forwards',

        // Slide up while fading in
        'slide-up': 'slideUp 0.6s ease-out forwards',

        // Slide in from sides
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',

        // Pulse for loading states
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      // Keyframes define the actual animation steps
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },

      // ===========================================
      // TRANSITIONS
      // ===========================================
      transitionDuration: {
        '400': '400ms',  // Slightly longer than default 300ms
      },

      // ===========================================
      // BREAKPOINTS (using Tailwind defaults but documented)
      // ===========================================
      // sm: 640px   - Large phones, small tablets
      // md: 768px   - Tablets
      // lg: 1024px  - Laptops, small desktops
      // xl: 1280px  - Desktops
      // 2xl: 1536px - Large screens
    },
  },

  // Plugins extend Tailwind's functionality
  plugins: [],
};
