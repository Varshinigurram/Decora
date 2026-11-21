import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HAS_LETTER_REGEX = /[a-zA-Z]/;
const HAS_DIGIT_REGEX = /[0-9]/;

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required.';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters long.';
    } else if (formData.fullName.trim().length > 100) {
      errors.fullName = 'Full name cannot exceed 100 characters.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else {
      if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters long.';
      } else if (!HAS_LETTER_REGEX.test(formData.password)) {
        errors.password = 'Password must contain at least one letter.';
      } else if (!HAS_DIGIT_REGEX.test(formData.password)) {
        errors.password = 'Password must contain at least one number.';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      // Customer account created and authenticated -> proceed to Design Boards
      navigate('/boards', { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Registration failed. Please check your information and try again.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="font-serif text-3xl font-semibold tracking-wider text-charcoal">
          DÉCORA
        </span>
        <h1 className="text-2xl font-serif font-medium text-charcoal">
          Create Your Account
        </h1>
        <p className="text-xs text-charcoal-muted">
          Persist custom variants, create design boards, and plan your living spaces.
        </p>
      </div>

      <div className="bg-white border border-sand/40 rounded p-8 space-y-5 shadow-subtle">
        {serverError && (
          <div
            role="alert"
            className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700"
          >
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="register-fullname"
              className="block text-xs uppercase tracking-wider text-taupe mb-1"
            >
              Full Name:
            </label>
            <input
              id="register-fullname"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Varsha Sharma"
              className={`w-full px-3.5 py-2.5 border rounded bg-white text-sm focus:outline-none focus:ring-1 ${
                fieldErrors.fullName
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-sand focus:ring-forest'
              }`}
            />
            {fieldErrors.fullName && (
              <p className="text-[11px] text-red-600 mt-1">{fieldErrors.fullName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="block text-xs uppercase tracking-wider text-taupe mb-1"
            >
              Email Address:
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              className={`w-full px-3.5 py-2.5 border rounded bg-white text-sm focus:outline-none focus:ring-1 ${
                fieldErrors.email
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-sand focus:ring-forest'
              }`}
            />
            {fieldErrors.email && (
              <p className="text-[11px] text-red-600 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="block text-xs uppercase tracking-wider text-taupe mb-1"
            >
              Password:
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 8 characters with letters & numbers"
              className={`w-full px-3.5 py-2.5 border rounded bg-white text-sm focus:outline-none focus:ring-1 ${
                fieldErrors.password
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-sand focus:ring-forest'
              }`}
            />
            {fieldErrors.password && (
              <p className="text-[11px] text-red-600 mt-1">{fieldErrors.password}</p>
            )}
            <p className="text-[10px] text-charcoal-muted mt-1">
              Minimum 8 characters, with at least one letter and one number.
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-xs text-charcoal-muted pt-2">
          Already registered?{' '}
          <Link to="/login" className="text-forest font-medium hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
