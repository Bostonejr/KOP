/**
 * Header Component - Site Navigation
 *
 * The header appears on every page and contains:
 * - Logo (left side) - "Kwabena Oppong-Peprah"
 * - Navigation links (right side) - Home, Portfolio, Contact
 *
 * Two visual modes:
 * 1. Transparent (default): Used on homepage where it overlays the hero image
 * 2. Solid: Used on other pages with a dark background
 *
 * On scroll, transparent headers become slightly opaque for readability.
 *
 * Design from Figma:
 * - Dark charcoal background (#333)
 * - White text with gold hover effects
 * - Fixed position (stays at top while scrolling)
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import NavLink from "./NavLink";

interface HeaderProps {
  /**
   * Visual variant:
   * - 'transparent': See-through, used on homepage with hero images
   * - 'solid': Dark background, used on other pages
   */
  variant?: "transparent" | "solid";
}

const Header: React.FC<HeaderProps> = ({ variant = "transparent" }) => {
  // Track scroll position to add background when scrolled
  const [isScrolled, setIsScrolled] = useState(false);

  // Get current URL to highlight active nav link
  const location = useLocation();

  /**
   * Scroll listener to detect when user scrolls down
   *
   * When scrolled more than 50px, we add a semi-transparent background
   * to the header for better readability over content.
   */
  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled more than 50 pixels
      setIsScrolled(window.scrollY > 50);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup: remove listener when component unmounts
    // This prevents memory leaks and errors
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Empty array = run once on mount

  // Navigation items configuration
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "Contact", path: "/contact" },
  ];

  /**
   * Determine if a nav item is active
   *
   * For home page, exact match required (/)
   * For other pages, check if current path starts with the nav path
   * This handles sub-routes like /portfolio/project-name
   */
  const isActive = (path: string): boolean => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.header
      // Framer Motion animation: header slides down from top on page load
      initial={{ y: -100 }} // Start 100px above viewport
      animate={{ y: 0 }} // Animate to natural position
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ zIndex: 9999, height: "100px" }} // Inline z-index and 90px height
      className={`
        /* Fixed positioning - stays at top while scrolling */
        fixed top-0 left-0 right-0

        /* Horizontal padding - responsive */
        px-6 md:px-12 lg:px-16

        /* Flex to center content vertically */
        flex items-center

        /* Smooth background transition */
        transition-all duration-300

        /*
          Background logic:
          - If scrolled OR solid variant: show dark background
          - Otherwise (transparent + at top): slight dark tint for visibility
        */
        ${
          isScrolled || variant === "solid"
            ? "bg-charcoal/95 backdrop-blur-sm"
            : "bg-black/20 backdrop-blur-[2px]"
        }
      `}
    >
      <nav className="flex items-center justify-between max-w-7xl mx-auto w-full">
        {/* Logo - Left side */}
        <Link
          to="/"
          style={{
            fontFamily: "'Caudex', Georgia, serif",
            fontWeight: 700,
            color: "#FFFFFF",
            fontSize: "24px",
            letterSpacing: "0.025em",
            textDecoration: "none",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#C9A96E";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#FFFFFF";
          }}
        >
          Kwabena Oppong-Peprah
        </Link>

        {/* Navigation - Right side */}
        <ul className="flex items-center gap-4 md:gap-6 lg:gap-8">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} isActive={isActive(item.path)}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
};

export default Header;
