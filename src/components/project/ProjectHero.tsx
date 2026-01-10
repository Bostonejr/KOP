/**
 * ProjectHero Component - Large Hero Image
 *
 * Displays the main project image at full width.
 * Appears below the project info section on the detail page.
 *
 * Animation:
 * - Fades in with a subtle scale effect
 * - Creates a cinematic reveal effect
 */

import { motion } from 'framer-motion';
import type { SanityImage } from '../../types/project';
import { imagePresets } from '../../lib/sanityImage';

interface ProjectHeroProps {
  image: SanityImage;     // Sanity image object
  projectName: string;    // Used for alt text fallback
}

const ProjectHero: React.FC<ProjectHeroProps> = ({ image, projectName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.02 }}  // Start slightly zoomed
      animate={{ opacity: 1, scale: 1 }}     // Animate to normal
      transition={{
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="w-full mb-12"
    >
      <img
        src={imagePresets.hero(image)}
        alt={image.alt || projectName}
        className="w-full h-auto object-cover"
      />
    </motion.div>
  );
};

export default ProjectHero;
