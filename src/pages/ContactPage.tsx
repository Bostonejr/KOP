/**
 * ContactPage - Get in Touch Form
 *
 * The contact page with a split layout:
 * - Left side: Contact form on gray background
 * - Right side: Architectural image
 *
 * On mobile, only the form is shown (image hidden).
 *
 * Animation:
 * - Form slides in from left
 * - Image slides in from right (on desktop)
 */

import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Header, Footer } from '../components/common';
import { ContactForm } from '../components/contact';

const ContactPage: React.FC = () => {
  return (
    <>
      {/* SEO meta tags */}
      <Helmet>
        <title>Contact | Kwabena Oppong-Peprah</title>
        <meta
          name="description"
          content="Get in touch with Kwabena Oppong-Peprah for architectural design inquiries and collaborations."
        />
      </Helmet>

      <Header variant="solid" />

      {/* Main content - split layout */}
      <main className="min-h-screen pt-16">
        <div className="
          grid grid-cols-1 lg:grid-cols-2
          min-h-[calc(100vh-64px)]
        ">
          {/* Left side - Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex"
          >
            <ContactForm />
          </motion.div>

          {/* Right side - Architectural image (hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            {/*
              Contact page image

              In production, this would come from Sanity CMS.
              For now, we'll use a placeholder or a static image.

              The image should be an architectural detail shot
              (like the wooden lattice roof from the Figma design).
            */}
            <div className="
              w-full h-full
              bg-charcoal
              flex items-center justify-center
            ">
              {/*
                Placeholder - replace with actual image when available

                You can either:
                1. Use a static image: <img src="/images/contact-hero.jpg" ... />
                2. Fetch from Sanity using site settings
              */}
              <div className="text-center text-white/30 font-sans text-sm p-8">
                <p>Contact image placeholder</p>
                <p className="text-xs mt-2">
                  Add image to Sanity CMS or place at<br />
                  /public/images/contact-hero.jpg
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ContactPage;
