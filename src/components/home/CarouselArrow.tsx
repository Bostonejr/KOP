/**
 * CarouselArrow Component - Navigation Button for Hero Carousel
 *
 * A square button with an arrow icon for navigating the carousel.
 * Matches the design from "Home page (Components).png"
 *
 * Design specs:
 * - Square shape (48x48px)
 * - Dark charcoal background with slight transparency
 * - White arrow icon
 * - On hover: Gold background, dark icon
 * - Smooth transition animation
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselArrowProps {
  direction: 'left' | 'right';  // Which way the arrow points
  onClick: () => void;          // Click handler
}

const CarouselArrow: React.FC<CarouselArrowProps> = ({ direction, onClick }) => {
  // Select the appropriate icon based on direction
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;

  return (
    <button
      onClick={onClick}
      className="
        /* Size - square button */
        w-12 h-12

        /* Flexbox centering for the icon */
        flex items-center justify-center

        /* Default state: semi-transparent dark bg, white icon */
        bg-charcoal/80 backdrop-blur-sm
        text-white

        /* Hover state: gold bg, dark icon */
        hover:bg-gold hover:text-charcoal

        /* Smooth transition for all properties */
        transition-all duration-300

        /* Group class for child hover effects */
        group

        /* Focus state for accessibility */
        focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2
      "
      aria-label={`Go to ${direction === 'left' ? 'previous' : 'next'} slide`}
    >
      <Icon
        size={24}
        className="
          transition-transform duration-300
          group-hover:scale-110
        "
      />
    </button>
  );
};

export default CarouselArrow;
