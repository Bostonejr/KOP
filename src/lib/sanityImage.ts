/**
 * Sanity Image URL Builder
 *
 * Sanity stores images with metadata, and we need to convert the image
 * references into actual URLs. The image URL builder does this AND lets
 * us apply transformations on-the-fly:
 *
 * - Resize images to exact dimensions
 * - Set quality (compress for faster loading)
 * - Apply crops using hotspot data
 * - Convert formats (auto WebP for supported browsers)
 *
 * Why this matters:
 * Original image: 4000x3000, 5MB
 * Optimized:      1200x800, 85KB  <- Much faster to load!
 *
 * Sanity's CDN handles the image processing, so we don't need our own server.
 */

import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './sanity';
import type { SanityImage } from '../types/project';

// Initialize the URL builder with our Sanity client
// This gives it access to our project settings
const builder = imageUrlBuilder(sanityClient);

/**
 * Base URL builder function
 *
 * Takes a Sanity image object and returns a builder that can be chained.
 * Example:
 *   urlFor(image).width(800).height(600).url()
 *
 * @param source - Sanity image object from CMS
 * @returns ImageUrlBuilder for chaining
 */
export function urlFor(source: SanityImage | null | undefined) {
  if (!source) {
    return null;
  }
  return builder.image(source);
}

/**
 * Preset image configurations for common use cases.
 *
 * Instead of writing .width(1920).quality(85).auto('format') everywhere,
 * we define presets that match our design needs.
 *
 * Usage:
 *   <img src={imagePresets.hero(project.mainImage)} />
 */
// Placeholder image for when no image is available
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"%3E%3Crect fill="%23333333" width="1920" height="1080"/%3E%3Ctext fill="%23666666" font-family="sans-serif" font-size="48" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';

export const imagePresets = {
  /**
   * Full-screen hero images (homepage carousel, project hero)
   * Large size for full-width display, high quality
   */
  hero: (source: SanityImage | null | undefined): string => {
    const builder = urlFor(source);
    if (!builder) return PLACEHOLDER_IMAGE;
    return builder
      .width(1920)           // Full HD width
      .quality(85)           // High quality (85% is sweet spot)
      .auto('format')        // Auto WebP for modern browsers
      .url();
  },

  /**
   * Portfolio grid thumbnails
   * Medium size, optimized for grid display
   */
  thumbnail: (source: SanityImage | null | undefined): string => {
    const builder = urlFor(source);
    if (!builder) return PLACEHOLDER_IMAGE;
    return builder
      .width(600)            // Good for grid items
      .height(400)           // Fixed aspect ratio
      .quality(80)           // Slightly lower for faster load
      .auto('format')
      .url();
  },

  /**
   * Project gallery images
   * Large but not full-screen
   */
  gallery: (source: SanityImage | null | undefined): string => {
    const builder = urlFor(source);
    if (!builder) return PLACEHOLDER_IMAGE;
    return builder
      .width(1200)           // Large enough for gallery view
      .quality(85)
      .auto('format')
      .url();
  },

  /**
   * Lightbox / full-size view
   * Maximum quality for detailed viewing
   */
  fullSize: (source: SanityImage | null | undefined): string => {
    const builder = urlFor(source);
    if (!builder) return PLACEHOLDER_IMAGE;
    return builder
      .width(2400)           // Very large for zoom
      .quality(90)
      .auto('format')
      .url();
  },

  /**
   * Low-quality placeholder for lazy loading
   * Tiny, blurred version shown while main image loads
   *
   * The blur effect is CSS-based, but this gives us a tiny
   * file (~2KB) to show immediately.
   */
  placeholder: (source: SanityImage | null | undefined): string => {
    const builder = urlFor(source);
    if (!builder) return PLACEHOLDER_IMAGE;
    return builder
      .width(50)             // Very small
      .blur(20)              // Heavy blur (hides pixelation)
      .quality(30)           // Low quality (tiny file)
      .url();
  },

  /**
   * Open Graph image for social sharing
   * Facebook/Twitter recommend 1200x630
   */
  og: (source: SanityImage | null | undefined): string => {
    const builder = urlFor(source);
    if (!builder) return PLACEHOLDER_IMAGE;
    return builder
      .width(1200)
      .height(630)
      .quality(80)
      .auto('format')
      .url();
  },
};

/**
 * Get srcset for responsive images
 *
 * Creates multiple image URLs at different widths.
 * The browser picks the best one based on screen size.
 *
 * Usage:
 *   <img
 *     src={imagePresets.thumbnail(image)}
 *     srcSet={generateSrcSet(image, [400, 600, 800, 1200])}
 *     sizes="(max-width: 768px) 100vw, 50vw"
 *   />
 */
export function generateSrcSet(
  source: SanityImage | null | undefined,
  widths: number[] = [400, 600, 800, 1200, 1600]
): string {
  const builder = urlFor(source);
  if (!builder) return '';
  return widths
    .map((width) =>
      `${builder.width(width).quality(80).auto('format').url()} ${width}w`
    )
    .join(', ');
}
