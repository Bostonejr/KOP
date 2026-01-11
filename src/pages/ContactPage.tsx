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
            className="hidden lg:block h-full"
          >
            <img
              src="/images/contact-hero.jpg"
              alt="Architectural design"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ContactPage;
