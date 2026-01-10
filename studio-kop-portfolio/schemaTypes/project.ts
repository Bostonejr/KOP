/**
 * Project Schema for Sanity CMS
 *
 * Defines the structure of each project in your portfolio.
 * This schema matches the data from your Portfolio.csv file.
 *
 * Fields:
 * - name: Project display name
 * - slug: URL-friendly identifier
 * - description: Full project description
 * - mainImage: Primary hero image
 * - projectImages: Gallery of additional images
 * - category: Residential, Social, Recreational, Religious
 * - status: Design, In Progress, Completed
 * - location: City/area name
 * - period: Year completed
 * - featured: Show in homepage carousel
 * - sortingNumber: Display order
 */

import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',

  // Group fields into tabs for better organization
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Media' },
    { name: 'metadata', title: 'Metadata' },
    { name: 'seo', title: 'SEO' },
  ],

  fields: [
    // ===========================================
    // CONTENT GROUP
    // ===========================================

    defineField({
      name: 'name',
      title: 'Project Name',
      type: 'string',
      group: 'content',
      description: 'The display name of the project (e.g., "Nana Peprah\'s Residence")',
      validation: (Rule) => Rule.required().min(2).max(100),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'URL-friendly identifier (auto-generated from name)',
      options: {
        source: 'name',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Project Description',
      type: 'text',
      group: 'content',
      description: 'Detailed description of the project',
      rows: 8,
      validation: (Rule) => Rule.required().min(50).max(3000),
    }),

    // ===========================================
    // MEDIA GROUP
    // ===========================================

    defineField({
      name: 'mainImage',
      title: 'Main Project Image',
      type: 'image',
      group: 'media',
      description: 'Primary hero image for the project (appears in carousel and as main image)',
      options: {
        hotspot: true, // Enables focal point selection for responsive cropping
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Describe the image for accessibility and SEO',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'projectImages',
      title: 'Project Images Gallery',
      type: 'array',
      group: 'media',
      description: 'Additional images shown in the project gallery',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption for this image',
            },
          ],
        },
      ],
    }),

    // ===========================================
    // METADATA GROUP
    // ===========================================

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'metadata',
      description: 'Project type classification',
      options: {
        list: [
          { title: 'Residential', value: 'Residential' },
          { title: 'Social', value: 'Social' },
          { title: 'Recreational', value: 'Recreational' },
          { title: 'Religious', value: 'Religious' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'status',
      title: 'Project Status',
      type: 'string',
      group: 'metadata',
      description: 'Current state of the project',
      options: {
        list: [
          { title: 'Design', value: 'Design' },
          { title: 'In Progress', value: 'In Progress' },
          { title: 'Completed', value: 'Completed' },
        ],
        layout: 'radio',
      },
      initialValue: 'Design',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'metadata',
      description: 'Where the project is located (e.g., "Accra", "Cape Coast")',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'period',
      title: 'Period/Year',
      type: 'string',
      group: 'metadata',
      description: 'Year or date range of the project (e.g., "2023", "2022-2024")',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      group: 'metadata',
      description: 'Show this project in the homepage carousel',
      initialValue: false,
    }),

    defineField({
      name: 'sortingNumber',
      title: 'Sorting Number',
      type: 'number',
      group: 'metadata',
      description: 'Order in which projects appear (lower numbers appear first)',
      initialValue: 99,
    }),

    // ===========================================
    // SEO GROUP
    // ===========================================

    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'seo',
      description: 'Search engine optimization settings',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Override the default page title (max 60 characters)',
          validation: (Rule) => Rule.max(60),
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Brief description for search engines (max 160 characters)',
          validation: (Rule) => Rule.max(160),
        },
      ],
    }),
  ],

  // Preview configuration for Sanity Studio
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'mainImage',
      featured: 'featured',
      status: 'status',
    },
    prepare({ title, subtitle, media, featured, status }) {
      return {
        title: featured ? `⭐ ${title}` : title,
        subtitle: `${subtitle} • ${status}`,
        media,
      };
    },
  },

  // Default ordering in the studio
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortingOrder',
      by: [{ field: 'sortingNumber', direction: 'asc' }],
    },
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Recently Updated',
      name: 'updatedDesc',
      by: [{ field: '_updatedAt', direction: 'desc' }],
    },
  ],
});
