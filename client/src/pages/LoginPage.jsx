import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
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
      const user = await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      // Internal redirect handling: reject external/protocol-relative URLs
      const fromPath = location.state?.from?.pathname;
      const isValidInternalRedirect =
        fromPath &&
        typeof fromPath === 'string' &&
        fromPath.startsWith('/') &&
        !fromPath.startsWith('//');

      if (isValidInternalRedirect) {
        navigate(fromPath, { replace: true });
      } else if (user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/boards', { replace: true });
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Unable to sign in. Please verify your email and password.';
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
          Welcome Back
        </h1>
        <p className="text-xs text-charcoal-muted">
          Sign in to access your saved customizations, boards, and wishlist.
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
              htmlFor="login-email"
              className="block text-xs uppercase tracking-wider text-taupe mb-1"
            >
              Email Address:
            </label>
            <input
              id="login-email"
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
              htmlFor="login-password"
              className="block text-xs uppercase tracking-wider text-taupe mb-1"
            >
              Password:
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-3.5 py-2.5 border rounded bg-white text-sm focus:outline-none focus:ring-1 ${
                fieldErrors.password
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-sand focus:ring-forest'
              }`}
            />
            {fieldErrors.password && (
              <p className="text-[11px] text-red-600 mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-xs text-charcoal-muted pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-forest font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
