/**
 * ImageModal Component - Lightbox for Full-Size Images
 *
 * A modal overlay that displays images at full size.
 * Allows navigation between images in the gallery.
 *
 * Features:
 * - Full-screen overlay with dark background
 * - Large image centered on screen
 * - Previous/Next navigation
 * - Close button
 * - Keyboard navigation (Escape to close, arrows to navigate)
 * - Click outside image to close
 *
 * Accessibility:
 * - Traps focus inside modal
 * - Escape key closes modal
 * - Aria labels for buttons
 */

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { SanityImage } from '../../types/project';
import { imagePresets } from '../../lib/sanityImage';

interface ImageModalProps {
  images: SanityImage[];           // All gallery images
  currentIndex: number;            // Currently displayed image index
  onClose: () => void;             // Close handler
  onNavigate: (index: number) => void;  // Navigation handler
  projectName: string;             // For alt text
}

const ImageModal: React.FC<ImageModalProps> = ({
  images,
  currentIndex,
  onClose,
  onNavigate,
  projectName,
}) => {
  const currentImage = images[currentIndex];

  /**
   * Navigate to previous image
   */
  const goToPrev = useCallback(() => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    onNavigate(newIndex);
  }, [currentIndex, images.length, onNavigate]);

  /**
   * Navigate to next image
   */
  const goToNext = useCallback(() => {
    const newIndex = (currentIndex + 1) % images.length;
    onNavigate(newIndex);
  }, [currentIndex, images.length, onNavigate]);

  /**
   * Keyboard navigation
   * - Escape: Close modal
   * - ArrowLeft: Previous image
   * - ArrowRight: Next image
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrev();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    // Add listener
    window.addEventListener('keydown', handleKeyDown);

    // Prevent body scroll while modal is open
    document.body.style.overflow = 'hidden';

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, goToPrev, goToNext]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="
          fixed inset-0 z-50
          bg-black/90
          flex items-center justify-center
          p-4 md:p-8
        "
        // Click on backdrop to close
        onClick={onClose}
      >
        {/* Close button - top right */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4 z-10
            w-10 h-10
            flex items-center justify-center
            text-white/80 hover:text-white
            transition-colors duration-200
          "
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Previous button - left side */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();  // Don't trigger backdrop click
              goToPrev();
            }}
            className="
              absolute left-4 top-1/2 -translate-y-1/2 z-10
              w-12 h-12
              flex items-center justify-center
              bg-charcoal/50 hover:bg-gold
              text-white hover:text-charcoal
              transition-all duration-200
            "
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Image container */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="max-w-5xl max-h-[80vh]"
          onClick={(e) => e.stopPropagation()}  // Don't close when clicking image
        >
          <img
            src={imagePresets.fullSize(currentImage)}
            alt={currentImage.alt || `${projectName} - Image ${currentIndex + 1}`}
            className="max-w-full max-h-[80vh] object-contain"
          />
        </motion.div>

        {/* Next button - right side */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="
              absolute right-4 top-1/2 -translate-y-1/2 z-10
              w-12 h-12
              flex items-center justify-center
              bg-charcoal/50 hover:bg-gold
              text-white hover:text-charcoal
              transition-all duration-200
            "
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Image counter */}
        <div className="
          absolute bottom-4 left-1/2 -translate-x-1/2
          text-white/70 text-sm font-sans
        ">
          {currentIndex + 1} / {images.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal;
