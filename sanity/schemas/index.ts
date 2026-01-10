/**
 * Sanity Schema Index
 *
 * Export all schema types for use in sanity.config.ts
 */

import project from './project';
import siteSettings from './siteSettings';

export const schemaTypes = [project, siteSettings];
