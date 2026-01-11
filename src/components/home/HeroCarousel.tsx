/**
 * HeroCarousel Component - Full-Screen Image Slider
 *
 * The main hero section of the homepage featuring:
 * - Full-screen background images of featured projects
 * - Project name overlay at bottom-left (clickable)
 * - Navigation arrows at bottom-right
 * - Dot indicators at bottom-center
 * - Auto-advance functionality
 *
 * This is a complex component demonstrating:
 * - State management for current slide
 * - Interval timers for auto-advance
 * - Keyboard navigation (left/right arrows)
 * - Touch/swipe support could be added
 * - Framer Motion for smooth transitions
 */

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { FeaturedProject } from '../../types/project';
import { imagePresets } from '../../lib/sanityImage';
import CarouselArrow from './CarouselArrow';

interface HeroCarouselProps {
  projects: FeaturedProject[];   // Array of featured projects to display
  autoPlayInterval?: number;      // Time between slides in ms (default: 6000)
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({
  projects,
  autoPlayInterval = 8000,  // 8 seconds per slide (longer to accommodate 4s fade)
}) => {
  // Current slide index (0-based)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Direction of animation: -1 for left, 1 for right
  // This determines which way slides enter/exit
  const [direction, setDirection] = useState(0);

  /**
   * Navigate to the next slide
   *
   * useCallback memoizes this function so it doesn't change on every render.
   * This is important for the useEffect dependency array.
   */
  const goToNext = useCallback(() => {
    setDirection(1);  // Slide from right
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  /**
   * Navigate to the previous slide
   */
  const goToPrev = useCallback(() => {
    setDirection(-1);  // Slide from left
    // Add projects.length to handle negative numbers before modulo
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  /**
   * Go to a specific slide (used by dot indicators)
   */
  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  /**
   * Auto-advance timer
   *
   * Sets up an interval that advances to the next slide.
   * Returns a cleanup function that clears the interval.
   */
  useEffect(() => {
    const timer = setInterval(goToNext, autoPlayInterval);

    // Cleanup: clear interval when component unmounts
    // or when dependencies change
    return () => clearInterval(timer);
  }, [goToNext, autoPlayInterval]);

  /**
   * Keyboard navigation
   *
   * Allow users to navigate with left/right arrow keys.
   * Good for accessibility!
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext]);

  // Get current project
  const currentProject = projects[currentIndex];

  /**
   * Animation variants for slide transitions
   * Using soft fade in/out transition (4 seconds)
   */
  const slideVariants = {
    enter: {
      opacity: 0,
    },
    center: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };

  // Don't render if no projects
  if (!projects.length) return null;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-charcoal">
      {/*
        Image slides with AnimatePresence for exit animations

        AnimatePresence tracks components by key and plays exit
        animations when they're removed from the DOM.
      */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}  // Unique key triggers animation on change
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            opacity: { duration: 2, ease: 'easeInOut' },  // 2s fade out + 2s fade in = 4s total
          }}
          className="absolute inset-0"
        >
          {/* Background image */}
          <img
            src={imagePresets.hero(currentProject.mainImage)}
            alt={currentProject.name}
            className="w-full h-full object-cover"
          />

          {/*
            Gradient overlay

            Creates a dark gradient at the bottom for text readability.
            The gradient goes from transparent at top to dark at bottom.
          */}
          <div className="
            absolute inset-0
            bg-gradient-to-t from-black/60 via-transparent to-black/30
          " />
        </motion.div>
      </AnimatePresence>

      {/*
        Project name overlay - bottom left

        Animated separately so it doesn't slide with the image.
        Links to the project detail page.
      */}
      <motion.div
        key={`title-${currentIndex}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute bottom-24 left-6 md:left-12 lg:left-16 z-10"
      >
        <Link
          to={`/portfolio/${currentProject.slug}`}
          className="group"
        >
          <h2
            style={{ fontFamily: "'Caudex', Georgia, serif", fontWeight: 700 }}
            className="
              text-white text-xl md:text-3xl lg:text-4xl
              group-hover:text-gold transition-colors duration-300
            "
          >
            {currentProject.name}
          </h2>
        </Link>
      </motion.div>

      {/* Navigation arrows - bottom right */}
      <div className="
        absolute bottom-24 right-6 md:right-12 lg:right-16 z-10
        flex gap-4
      ">
        <CarouselArrow direction="left" onClick={goToPrev} />
        <CarouselArrow direction="right" onClick={goToNext} />
      </div>

      {/*
        Slide indicators (dots) - bottom center

        Each dot represents a slide. Clicking jumps to that slide.
        The current slide's dot is wider and gold-colored.
      */}
      <div className="
        absolute bottom-8 left-1/2 -translate-x-1/2 z-10
        flex gap-2
      ">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`
              h-2 rounded-full transition-all duration-300
              ${index === currentIndex
                ? 'bg-gold w-8'           // Active: gold, wider
                : 'bg-white/50 w-2 hover:bg-white/80'  // Inactive: white, circle
              }
            `}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? 'true' : 'false'}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
