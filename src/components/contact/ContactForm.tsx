/**
 * ContactForm Component - "Get in Touch" Form
 *
 * The contact form section of the contact page.
 * Currently visual only - no backend integration.
 *
 * Fields:
 * - First Name (required)
 * - Last Name (required)
 * - Email (required)
 * - Message (required)
 *
 * Design:
 * - Gray background (#E5E5E5)
 * - Italic serif heading "Get in Touch"
 * - Underline-style inputs
 * - Gold hover effect on submit button
 *
 * Note: This is visual only for now. Backend integration can be added later
 * using services like Resend, EmailJS, or a custom API endpoint.
 */

import { useState } from "react";
import FormInput from "./FormInput";

const ContactForm: React.FC = () => {
  // Form state - stores all field values
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  // Submission state for visual feedback
  const [isSubmitted, setIsSubmitted] = useState(false);

  /**
   * Handle input changes
   *
   * Updates the corresponding field in formData state.
   * The [name]: value syntax allows dynamic key assignment.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle form submission
   *
   * Currently just shows a success message (visual only).
   * TODO: Add backend integration for actual email sending.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission (page reload)

    // For now, just show success message
    // In production, you would send the data to a backend here
    console.log("Form submitted:", formData);
    setIsSubmitted(true);

    // Reset form after short delay
    setTimeout(() => {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
      });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="bg-light-gray h-full p-8 md:p-12 lg:p-16">
      {/* Heading - italic serif font */}
      <h1
        className="
        font-serif text-2xl md:text-3xl lg:text-4xl text-charcoal
        mb-12 
      "
      >
        Get in Touch
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        {/* Name fields - side by side on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="First name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Last name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email field */}
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Message field - textarea */}
        <FormInput
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          multiline
          rows={5}
          required
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitted}
          className={`
            w-full py-3
            font-sans text-sm
            transition-all duration-300
            ${
              isSubmitted
                ? "bg-gold text-charcoal cursor-default"
                : "bg-charcoal/50 text-white hover:bg-gold hover:text-charcoal"
            }
          `}
        >
          {isSubmitted ? "Message Sent!" : "Send"}
        </button>

        {/* Note about form being visual only (can be removed in production) */}
        <p className="text-xs text-charcoal/40 text-center mt-4">
          Form submission is not yet connected to a backend.
        </p>
      </form>
    </div>
  );
};

export default ContactForm;
