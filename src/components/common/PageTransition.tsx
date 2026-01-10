/**
 * PageTransition Component - Smooth Page Transitions
 *
 * Wraps page content to provide smooth fade/slide animations
 * when navigating between pages.
 *
 * How it works:
 * 1. When a new page mounts, it fades/slides in
 * 2. When leaving a page, it fades/slides out
 * 3. AnimatePresence from Framer Motion handles the exit animations
 *
 * This creates a more polished, app-like experience compared to
 * instant page changes in traditional websites.
 *
 * Animation details:
 * - Initial: Invisible, slightly below final position
 * - Enter: Fade in + slide up to final position
 * - Exit: Fade out + slide up out of view
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;  // The page content to wrap
}

/**
 * Animation variants define the different states of the animation.
 *
 * Think of variants as keyframes:
 * - initial: Starting state (before component appears)
 * - enter: Final state (component fully visible)
 * - exit: End state (component leaving)
 */
const pageVariants = {
  initial: {
    opacity: 0,      // Start invisible
    y: 20,           // Start 20px below final position
  },
  enter: {
    opacity: 1,      // Fully visible
    y: 0,            // At final position
    transition: {
      duration: 0.5, // Half second animation
      ease: [0.25, 0.1, 0.25, 1] as const,  // Custom cubic bezier for smooth feel
      when: 'beforeChildren' as const,      // Animate parent before children
      staggerChildren: 0.1,        // Delay between child animations
    },
  },
  exit: {
    opacity: 0,      // Fade out
    y: -20,          // Slide up while exiting
    transition: {
      duration: 0.3, // Faster exit than enter
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  // Get current path to use as animation key
  const location = useLocation();

  return (
    /*
      AnimatePresence handles exit animations.

      The key prop is crucial - React uses it to track which components
      are the same. When the key changes (new page), React unmounts the
      old component and mounts a new one. AnimatePresence intercepts
      this to play exit animations before removal.

      mode="wait" means the exit animation completes before the enter
      animation starts. Without it, both would play simultaneously.
    */
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}  // Unique key per page
        initial="initial"        // Use initial variant on mount
        animate="enter"          // Animate to enter variant
        exit="exit"              // Use exit variant on unmount
        variants={pageVariants}  // Apply our defined variants
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
