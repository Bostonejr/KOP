/**
 * ImageGallery Component - Project Image Grid
 *
 * Displays additional project images in a responsive grid.
 * Each image is clickable and opens in a lightbox modal.
 *
 * Grid Layout:
 * - 2 columns on mobile
 * - 3 columns on tablet and desktop
 *
 * Features:
 * - Lazy loading for performance
 * - Hover scale effect
 * - Click to open lightbox (handled by parent)
 * - Staggered fade-in animation
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { SanityImage } from '../../types/project';
import { imagePresets } from '../../lib/sanityImage';
import ImageModal from './ImageModal';

interface ImageGalleryProps {
  images: SanityImage[];   // Array of gallery images
  projectName: string;     // For alt text fallback
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, projectName }) => {
  // Track which image is open in the lightbox (null = closed)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      {/* Image grid */}
      <div className="
        grid
        grid-cols-2       /* 2 columns on mobile */
        md:grid-cols-3    /* 3 columns from 768px up */
        gap-4
      ">
        {images.map((image, index) => (
          <motion.button
            key={index}
            // Staggered fade-in animation
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.05,  // 50ms stagger between items
              duration: 0.4,
            }}
            // Click to open lightbox at this index
            onClick={() => setSelectedIndex(index)}
            className="
              overflow-hidden cursor-pointer
              transform transition-transform duration-300
              hover:scale-[1.02]
              focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2
            "
          >
            <img
              src={imagePresets.gallery(image)}
              alt={image.alt || `${projectName} - Image ${index + 1}`}
              className="w-full h-full object-cover aspect-[3/2]"
              loading="lazy"  // Native lazy loading
            />
          </motion.button>
        ))}
      </div>

      {/* Lightbox modal - only renders when an image is selected */}
      {selectedIndex !== null && (
        <ImageModal
          images={images}
          currentIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNavigate={setSelectedIndex}
          projectName={projectName}
        />
      )}
    </>
  );
};

export default ImageGallery;
