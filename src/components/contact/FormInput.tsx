/**
 * FormInput Component - Styled Form Field
 *
 * A reusable form input component that supports:
 * - Text input
 * - Email input
 * - Textarea (multiline)
 *
 * Styling matches the Figma design:
 * - Transparent background
 * - Bottom border only
 * - Label above the input
 * - Dark charcoal text
 */

interface FormInputProps {
  label: string;           // Field label
  name: string;            // Input name (for form handling)
  type?: string;           // Input type: 'text', 'email', etc.
  value: string;           // Current value
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;      // Is field required?
  multiline?: boolean;     // Use textarea instead of input?
  rows?: number;           // Textarea rows (if multiline)
  placeholder?: string;    // Placeholder text
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  multiline = false,
  rows = 4,
  placeholder,
}) => {
  // Shared CSS classes for both input and textarea
  const inputClasses = `
    w-full px-0 py-2
    bg-transparent border-b border-charcoal/30
    text-charcoal font-sans text-sm
    placeholder:text-charcoal/40
    focus:outline-none focus:border-charcoal
    transition-colors duration-200
  `;

  return (
    <div>
      {/* Label */}
      <label
        htmlFor={name}
        className="block font-sans text-xs text-charcoal/70 mb-1"
      >
        {label}
        {required && ' *'}
      </label>

      {/* Render textarea or input based on multiline prop */}
      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          placeholder={placeholder}
          className={`${inputClasses} resize-none`}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
    </div>
  );
};

export default FormInput;
