/**
 * LazyImage Component - Optimized Image Loading
 *
 * A smart image component that provides:
 * 1. Lazy loading - images load only when they enter the viewport
 * 2. Placeholder blur - shows a blurry preview while loading
 * 3. Fade-in animation - smooth transition when image loads
 * 4. Error handling - shows fallback if image fails to load
 *
 * Why lazy loading matters:
 * - Faster initial page load (fewer images to download)
 * - Reduced bandwidth usage (don't load images user won't see)
 * - Better performance scores (Core Web Vitals)
 *
 * The blur placeholder technique:
 * 1. Load a tiny (50px) blurred version instantly (~2KB)
 * 2. Show it with CSS blur to hide pixelation
 * 3. Load full image in background
 * 4. Fade in full image over the blur
 * 5. Remove blur placeholder
 */

import { useState } from 'react';
import { motion } from 'framer-motion';

interface LazyImageProps {
  src: string;              // Full-size image URL
  placeholderSrc?: string;  // Tiny blurred placeholder URL
  alt: string;              // Alt text for accessibility (required!)
  className?: string;       // Additional CSS classes
  aspectRatio?: string;     // Tailwind aspect ratio class (e.g., "aspect-video")
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  placeholderSrc,
  alt,
  className = '',
  aspectRatio = 'aspect-video',  // 16:9 default
}) => {
  // Track whether the main image has finished loading
  const [isLoaded, setIsLoaded] = useState(false);

  // Track if there was an error loading the image
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className}`}>
      {/*
        Placeholder image (blurry preview)

        Shows while main image is loading. Uses a tiny image with CSS blur
        to create a pleasing preview effect.

        aria-hidden="true" hides this from screen readers since it's purely decorative.
      */}
      {placeholderSrc && !isLoaded && !hasError && (
        <img
          src={placeholderSrc}
          alt=""  // Empty alt for decorative image
          className="
            absolute inset-0 w-full h-full object-cover
            blur-lg scale-110
          "
          aria-hidden="true"
        />
      )}

      {/*
        Main image with fade-in animation

        The motion.img from Framer Motion lets us animate opacity.
        onLoad fires when the image finishes loading.
        onError fires if the image fails to load.
      */}
      <motion.img
        src={src}
        alt={alt}
        initial={{ opacity: 0 }}                    // Start invisible
        animate={{ opacity: isLoaded ? 1 : 0 }}    // Fade in when loaded
        transition={{ duration: 0.6, ease: 'easeOut' }}
        onLoad={() => setIsLoaded(true)}           // Mark as loaded
        onError={() => setHasError(true)}          // Handle errors
        className={`
          w-full h-full object-cover
          ${isLoaded ? '' : 'invisible'}
        `}
        loading="lazy"  // Native lazy loading (browser-level)
      />

      {/*
        Loading skeleton

        Shows a pulsing gray rectangle while loading.
        Only visible if no placeholder and not yet loaded.
      */}
      {!isLoaded && !hasError && !placeholderSrc && (
        <div className="absolute inset-0 bg-light-gray animate-pulse" />
      )}

      {/*
        Error state

        Shows a message if the image failed to load.
        Better than showing a broken image icon.
      */}
      {hasError && (
        <div className="
          absolute inset-0 bg-light-gray
          flex items-center justify-center
        ">
          <span className="text-charcoal/50 text-sm font-sans">
            Image unavailable
          </span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
