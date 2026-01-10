/**
 * Site Settings Schema for Sanity CMS
 *
 * Global settings that appear across the entire site.
 * This is a "singleton" document - there's only one.
 *
 * Contains:
 * - Site name and description
 * - Contact information
 * - Social media links
 * - Footer content
 * - Contact page image
 */

import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',

  // Group fields for organization
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'contact', title: 'Contact Info' },
    { name: 'social', title: 'Social Media' },
  ],

  fields: [
    // ===========================================
    // GENERAL GROUP
    // ===========================================

    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      group: 'general',
      description: 'The name shown in the header and page titles',
      initialValue: 'Kwabena Oppong-Peprah',
    }),

    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      group: 'general',
      rows: 3,
      description: 'Default meta description for SEO (used when pages don\'t have their own)',
      initialValue: 'Architectural portfolio of Kwabena Oppong-Peprah, featuring residential, social, recreational, and religious projects in Ghana.',
    }),

    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      group: 'general',
      description: 'Text shown in the footer copyright notice',
      initialValue: 'Kwabena Oppong-Peprah',
    }),

    defineField({
      name: 'contactPageImage',
      title: 'Contact Page Image',
      type: 'image',
      group: 'general',
      description: 'The architectural image shown on the right side of the contact page',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),

    // ===========================================
    // CONTACT GROUP
    // ===========================================

    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      group: 'contact',
      description: 'Contact phone number (e.g., "+233 244695644")',
      initialValue: '+233 244695644',
    }),

    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      group: 'contact',
      description: 'Contact email address',
      initialValue: 'kwabena.oppong.peprah@gmail.com',
      validation: (Rule) => Rule.email(),
    }),

    // ===========================================
    // SOCIAL GROUP
    // ===========================================

    defineField({
      name: 'linkedIn',
      title: 'LinkedIn URL',
      type: 'url',
      group: 'social',
      description: 'Full URL to LinkedIn profile',
    }),

    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
      group: 'social',
      description: 'Full URL to Instagram profile',
    }),

    defineField({
      name: 'facebook',
      title: 'Facebook URL',
      type: 'url',
      group: 'social',
      description: 'Full URL to Facebook page',
    }),
  ],

  // Preview in the studio
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
        subtitle: 'Global site configuration',
      };
    },
  },
});
