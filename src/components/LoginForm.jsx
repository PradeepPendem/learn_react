import React, { useState } from 'react';

export default function LoginForm() {
  // 1. Unified state for form fields
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // 2. Separate states for UI feedback
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // 3. The CORRECT dynamic change handler (using spread operator)
  const handleChange = (e) => {
    const { name, value } = e.target;
    let obj = formData;
    setFormData((prev) => ({
      ...prev, // Preserves the other fields!
      [name]: value,
    }));
    obj[name] = value;

    // Clear field-specific error when the user starts typing again
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    validateForm(obj);
  };

  // 4. Client-side validation logic
  const validateForm = (obj) => {
    const newErrors = {};
    if (!obj.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (obj.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    setErrors(newErrors);

    // Returns true if there are NO keys in the newErrors object
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Use the boolean return directly to avoid async state traps
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Login successful:', formData);
      // Redirect or update auth state here
    } catch (err) {
      setServerError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false); // Always stop the loading state
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        noValidate // Disables browser's default HTML5 validation bubbles
      >
        <h2 className="">Sign In</h2>

        {/* Global Server Error */}
        {serverError && (
          <div
            className="bg-red-50 text-red-600 p-3 rounded border border-red-200 text-sm"
            role="alert"
          >
            {serverError}
          </div>
        )}

        {/* Email Field */}
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
            className={`border p-2 rounded focus:outline-none focus:ring-2 ${
              errors.email
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200'
            }`}
          />
          {errors.email && (
            <div className="text-red-500 text-xs">{errors.email}</div>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            aria-invalid={!!errors.password}
            className={`border p-2 rounded focus:outline-none focus:ring-2 ${
              errors.password
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200'
            }`}
          />
          {errors.password && (
            <div className="text-red-500 text-xs">{errors.password}</div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-4 p-2 rounded text-white font-medium transition-colors ${
            isSubmitting
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
