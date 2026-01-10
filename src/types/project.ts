/**
 * TypeScript Type Definitions for Project Data
 *
 * These types define the shape of our data. TypeScript uses them to:
 * 1. Catch errors at compile time (before running the code)
 * 2. Provide autocomplete in your editor
 * 3. Document what properties objects should have
 *
 * The types match the Sanity CMS schema and the Portfolio.csv structure.
 *
 * Key TypeScript concepts used here:
 * - interface: Defines the shape of an object
 * - type: Creates a type alias (can be union, intersection, etc.)
 * - optional properties (?): Property might not exist
 * - union types (|): Value can be one of several types
 */

// ===========================================
// SANITY IMAGE TYPE
// ===========================================

/**
 * Sanity stores images with metadata for optimization.
 * The asset._ref is used to build the actual image URL.
 *
 * Example from your CSV:
 * "wix:image://v1/f886ce_b744071b422543c1bed04229c4d45d8f~mv2.jpg/Pool-Side-View_01B.jpg"
 *
 * Sanity will have a similar structure but cleaner.
 */
export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;     // Reference ID to the actual image file
    _type: 'reference';
  };
  alt?: string;       // Alternative text for accessibility
  caption?: string;   // Optional caption
  hotspot?: {         // Focal point for smart cropping
    x: number;        // 0-1, where 0.5 is center
    y: number;
  };
}

// ===========================================
// PROJECT CATEGORIES
// ===========================================

/**
 * Union type for project categories.
 * A union type means the value must be ONE of these strings.
 *
 * This prevents typos:
 * ❌ category: "Residentail" (typo) - TypeScript error!
 * ✅ category: "Residential" - OK
 */
export type ProjectCategory =
  | 'Residential'
  | 'Social'
  | 'Recreational'
  | 'Religious';

/**
 * Project status options
 */
export type ProjectStatus =
  | 'Design'
  | 'In Progress'
  | 'Completed';

// ===========================================
// PROJECT INTERFACES
// ===========================================

/**
 * Full project data - used on project detail pages
 *
 * This matches the Sanity schema we'll create.
 * All the fields from your Portfolio.csv are represented here.
 */
export interface Project {
  _id: string;                    // Sanity's unique document ID
  name: string;                   // "Nana Peprah's Residence"
  slug: string;                   // "nana-peprahs-residence" (URL-friendly)
  description: string;            // Long project description
  mainImage: SanityImage;         // Hero/primary image
  projectImages?: SanityImage[];  // Gallery of additional images
  category: ProjectCategory;      // "Residential", "Social", etc.
  status: ProjectStatus;          // "Design", "In Progress", "Completed"
  location: string;               // "Accra", "Cape Coast", etc.
  period: string;                 // "2023", "2024", etc.
  featured: boolean;              // Show in homepage carousel?
  sortingNumber: number;          // Display order (lower = first)
  seo?: {                         // Optional SEO overrides
    metaTitle?: string;
    metaDescription?: string;
  };
}

/**
 * Simplified project for list views (portfolio grid)
 *
 * Why have a separate type? Performance!
 * The portfolio grid doesn't need the full description or all images.
 * Fetching only what we need makes the page load faster.
 */
export interface ProjectListItem {
  _id: string;
  name: string;
  slug: string;
  mainImage: SanityImage;
  category: ProjectCategory;
}

/**
 * Featured project for homepage carousel
 * Even simpler - just what the carousel needs
 */
export interface FeaturedProject {
  _id: string;
  name: string;
  slug: string;
  mainImage: SanityImage;
}

// ===========================================
// NAVIGATION HELPERS
// ===========================================

/**
 * Adjacent projects for "Previous" / "Next" navigation
 * Used on the project detail page
 */
export interface AdjacentProjects {
  previous: { name: string; slug: string } | null;
  next: { name: string; slug: string } | null;
}

// ===========================================
// SITE SETTINGS
// ===========================================

/**
 * Global site settings from CMS
 * Things that appear on every page (header, footer)
 */
export interface SiteSettings {
  siteName: string;           // "Kwabena Oppong-Peprah"
  siteDescription: string;    // For SEO
  contactInfo: {
    phone: string;            // "+233 244695644"
    email: string;            // "kwabena.oppong.peprah@gmail.com"
    linkedIn?: string;        // Social media links
    instagram?: string;
    facebook?: string;
  };
  contactPageImage?: SanityImage;  // Image on contact page
  copyrightText: string;           // "Kwabena Oppong-Peprah"
}

// ===========================================
// CATEGORY FILTER
// ===========================================

/**
 * Type for the category filter dropdown
 * 'All' is special - it shows all projects regardless of category
 */
export type CategoryFilter = ProjectCategory | 'All';
