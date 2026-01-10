/**
 * Sanity GROQ Queries
 *
 * GROQ (Graph-Relational Object Queries) is Sanity's query language.
 * It's like SQL but designed for JSON document databases.
 *
 * Basic GROQ syntax:
 * - *[] selects all documents
 * - *[_type == "project"] filters by document type
 * - | order(field asc) sorts results
 * - { field1, field2 } picks specific fields (like SELECT in SQL)
 *
 * Why centralize queries here?
 * 1. Easier to maintain - all queries in one place
 * 2. Prevents duplication - reuse across components
 * 3. Easier to optimize - can add indexes, caching hints
 *
 * Examples:
 * - SQL: SELECT name, slug FROM projects WHERE featured = true ORDER BY sortingNumber
 * - GROQ: *[_type == "project" && featured == true] | order(sortingNumber asc) { name, slug }
 */

// ===========================================
// PROJECT QUERIES
// ===========================================

/**
 * Fetch all projects
 *
 * Used on: Portfolio page (full list)
 * Returns: Basic info for grid display
 */
export const projectsQuery = `
  *[_type == "project"] | order(sortingNumber asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    mainImage,
    category,
    status,
    location,
    period,
    featured,
    sortingNumber
  }
`;

/**
 * Fetch projects filtered by category
 *
 * Used on: Portfolio page when filter is selected
 * Params: { category: "Residential" }
 *
 * The $category is a parameter - we pass it when executing the query.
 * This prevents SQL injection-like issues and allows query caching.
 */
export const projectsByCategoryQuery = `
  *[_type == "project" && category == $category] | order(sortingNumber asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    mainImage,
    category,
    status,
    location,
    period
  }
`;

/**
 * Fetch featured projects for homepage carousel
 *
 * Used on: Homepage
 * Returns: Only essential fields for carousel display
 *
 * The && featured == true filter ensures only featured projects appear.
 */
export const featuredProjectsQuery = `
  *[_type == "project" && featured == true] | order(sortingNumber asc) {
    _id,
    name,
    "slug": slug.current,
    mainImage,
    category
  }
`;

/**
 * Fetch single project by slug
 *
 * Used on: Project detail page
 * Params: { slug: "nana-peprahs-residence" }
 *
 * [0] at the end returns the first (and should be only) match.
 * Without it, we'd get an array with one item.
 */
export const projectBySlugQuery = `
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    mainImage,
    projectImages,
    category,
    status,
    location,
    period,
    featured,
    sortingNumber,
    seo
  }
`;

/**
 * Fetch adjacent projects for Previous/Next navigation
 *
 * Used on: Project detail page navigation
 * Params: { currentSort: 3 }
 *
 * This is a more complex query that returns an object with two nested queries:
 * - previous: Project with lower sortingNumber (comes before)
 * - next: Project with higher sortingNumber (comes after)
 *
 * The [0] gets just the first match (closest to current).
 */
export const adjacentProjectsQuery = `
  {
    "previous": *[_type == "project" && sortingNumber < $currentSort] | order(sortingNumber desc)[0] {
      name,
      "slug": slug.current
    },
    "next": *[_type == "project" && sortingNumber > $currentSort] | order(sortingNumber asc)[0] {
      name,
      "slug": slug.current
    }
  }
`;

// ===========================================
// SITE SETTINGS QUERIES
// ===========================================

/**
 * Fetch site-wide settings
 *
 * Used on: Header, Footer, SEO defaults
 *
 * Site settings is a "singleton" - there's only one document of this type.
 * We use [0] to get the document directly instead of an array.
 */
export const siteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    siteName,
    siteDescription,
    contactInfo,
    contactPageImage,
    copyrightText
  }
`;

// ===========================================
// UTILITY QUERIES
// ===========================================

/**
 * Fetch all unique categories
 *
 * Used on: Portfolio page filter dropdown
 *
 * array::unique() is a GROQ function that removes duplicates.
 * We extract just the category field from all projects.
 */
export const categoriesQuery = `
  array::unique(*[_type == "project"].category)
`;

/**
 * Get total project count
 *
 * Useful for pagination or stats display
 *
 * count() returns the number of matching documents.
 */
export const projectCountQuery = `
  count(*[_type == "project"])
`;

/**
 * Get project count by category
 *
 * Useful for showing "Residential (5)" in filter dropdown
 */
export const projectCountByCategoryQuery = `
  {
    "residential": count(*[_type == "project" && category == "Residential"]),
    "social": count(*[_type == "project" && category == "Social"]),
    "recreational": count(*[_type == "project" && category == "Recreational"]),
    "religious": count(*[_type == "project" && category == "Religious"])
  }
`;
