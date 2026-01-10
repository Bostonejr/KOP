/**
 * CategoryFilter Component - Dropdown for Filtering Projects
 *
 * A custom dropdown selector for filtering projects by category.
 * Matches the design from the Portfolio page Figma mockup.
 *
 * Features:
 * - Styled dropdown (not native select for consistency)
 * - Click outside to close
 * - Keyboard accessible
 * - Options: All, Residential, Social, Recreational, Religious
 *
 * Why custom dropdown instead of native <select>?
 * - Consistent styling across browsers
 * - More control over animations and appearance
 * - Better matches the design system
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ProjectCategory, CategoryFilter as CategoryFilterType } from '../../types/project';

interface CategoryFilterProps {
  categories: ProjectCategory[];           // Available categories
  selectedCategory: CategoryFilterType;    // Currently selected ('All' or category)
  onCategoryChange: (category: CategoryFilterType) => void;  // Selection handler
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  // Track whether dropdown is open
  const [isOpen, setIsOpen] = useState(false);

  // Ref for detecting clicks outside the dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Close dropdown when clicking outside
   *
   * Uses a ref to check if the click target is inside our dropdown.
   * If not, close the dropdown.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Only add listener when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  /**
   * Handle keyboard navigation
   *
   * - Enter/Space: Toggle dropdown or select option
   * - Escape: Close dropdown
   * - Arrow keys: Navigate options (could be added)
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // All options including "All"
  const allOptions: CategoryFilterType[] = ['All', ...categories];

  // Display text for the selected option
  const displayText = selectedCategory === 'All'
    ? 'Filter by Category'
    : selectedCategory;

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onKeyDown={handleKeyDown}
    >
      {/* Dropdown trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center justify-between gap-4
          px-4 py-2 min-w-[200px]
          bg-white border border-charcoal/20
          text-charcoal font-sans text-sm
          hover:border-charcoal/40
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2
        "
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedCategory === 'All' ? 'text-charcoal/60' : ''}>
          {displayText}
        </span>
        <ChevronDown
          size={18}
          className={`
            transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}
          `}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="
            absolute top-full left-0 right-0 mt-1 z-20
            bg-white border border-charcoal/20 shadow-lg
          "
          role="listbox"
          aria-label="Category filter"
        >
          {allOptions.map((option) => (
            <button
              key={option}
              onClick={() => {
                onCategoryChange(option);
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-2 text-left text-sm font-sans
                transition-colors duration-200
                ${selectedCategory === option
                  ? 'bg-light-gray text-charcoal font-medium'
                  : 'hover:bg-light-gray/50 text-charcoal/80'}
              `}
              role="option"
              aria-selected={selectedCategory === option}
            >
              {option === 'All' ? 'All Categories' : option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
