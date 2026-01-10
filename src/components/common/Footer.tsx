/**
 * Footer Component - Site Footer with Contact Info
 *
 * The footer appears on every page and displays:
 * - Call: Phone number
 * - Email: Email address
 * - Follow: Social media links (LinkedIn, Instagram, Facebook)
 * - Copyright notice
 *
 * Layout from Figma:
 * - Three-column grid for contact info
 * - Centered text
 * - Dark charcoal background (#333)
 * - White text with gold hover effects on links
 */

import { Linkedin, Instagram, Facebook } from 'lucide-react';

interface FooterProps {
  // These can be passed from CMS, or use defaults
  phone?: string;
  email?: string;
  socialLinks?: {
    linkedIn?: string;
    instagram?: string;
    facebook?: string;
  };
}

const Footer: React.FC<FooterProps> = ({
  // Default values from design
  phone = '+233 244695644',
  email = 'kwabena.oppong.peprah@gmail.com',
  socialLinks = {
    linkedIn: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
  },
}) => {
  // Get current year for copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/*
          Contact info grid - 3 columns
          On mobile: stack vertically (1 column)
          On tablet+: 3 columns side by side
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 text-center">

          {/* Call section */}
          <div>
            <h3 className="font-sans text-sm font-medium mb-3 tracking-wider uppercase">
              Call
            </h3>
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}  // Remove spaces for tel: link
              className="
                text-white/80 hover:text-gold
                transition-colors duration-300
                font-sans text-sm
              "
            >
              {phone}
            </a>
          </div>

          {/* Email section */}
          <div>
            <h3 className="font-sans text-sm font-medium mb-3 tracking-wider uppercase">
              Email
            </h3>
            <a
              href={`mailto:${email}`}
              className="
                text-white/80 hover:text-gold
                transition-colors duration-300
                font-sans text-sm
              "
            >
              {email}
            </a>
          </div>

          {/* Social links section */}
          <div>
            <h3 className="font-sans text-sm font-medium mb-3 tracking-wider uppercase">
              Follow
            </h3>
            <div className="flex items-center justify-center gap-4">
              {/*
                Social icons using Lucide React
                Lucide is a beautiful icon library - each icon is an SVG component

                We only show icons for links that are provided.
                This is done with conditional rendering: {link && <component />}
              */}
              {socialLinks.linkedIn && (
                <a
                  href={socialLinks.linkedIn}
                  target="_blank"           // Open in new tab
                  rel="noopener noreferrer" // Security: prevents the new page from accessing window.opener
                  className="
                    text-white/80 hover:text-gold
                    transition-colors duration-300
                  "
                  aria-label="LinkedIn"     // Accessibility: screen readers announce this
                >
                  <Linkedin size={20} />
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    text-white/80 hover:text-gold
                    transition-colors duration-300
                  "
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              )}
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    text-white/80 hover:text-gold
                    transition-colors duration-300
                  "
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright notice */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-white/50 text-sm font-sans">
            Copyright &copy; {currentYear} Kwabena Oppong-Peprah
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
