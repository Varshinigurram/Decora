import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Heart, Compass, Sliders, Layout, Layers, Menu, X, User } from 'lucide-react';
import Button from '../common/Button';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Inspiration', path: '/inspiration', icon: Compass },
    { label: 'Catalog', path: '/catalog', icon: Layers },
    { label: 'Customizer', path: '/customizer', icon: Sliders },
    { label: 'Room Planner', path: '/room-planner', icon: Layout },
    { label: 'My Boards', path: '/boards', icon: Layers },
  ];

  const getLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-150 py-1 ${
      isActive
        ? 'text-forest border-b-2 border-forest font-semibold'
        : 'text-charcoal-muted hover:text-charcoal'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-md border-b border-sand/40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Identity Wordmark */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-wider text-charcoal group-hover:text-forest transition-colors">
            DÉCORA
          </span>
          <span className="text-[10px] uppercase tracking-widest text-taupe font-medium mt-1">
            Studio
          </span>
        </Link>

        {/* Desktop Primary Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className={getLinkClasses}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="hidden md:flex items-center space-x-5">
          <Link
            to="/wishlist"
            className="p-2 text-charcoal-muted hover:text-charcoal hover:bg-ivory-subtle rounded-full transition-colors relative"
            title="My Saved Items"
          >
            <Heart className="w-5 h-5" />
            <span className="sr-only">Wishlist</span>
          </Link>

          <Link to="/consultation">
            <Button variant="secondary" size="sm">
              Consultation
            </Button>
          </Link>

          <Link
            to="/login"
            className="p-2 text-charcoal-muted hover:text-charcoal hover:bg-ivory-subtle rounded-full transition-colors"
            title="Account"
          >
            <User className="w-5 h-5" />
            <span className="sr-only">Account</span>
          </Link>
        </div>

        {/* Mobile Hamburger Trigger */}
        <div className="flex md:hidden items-center space-x-2">
          <Link
            to="/wishlist"
            className="p-2 text-charcoal hover:bg-ivory-subtle rounded-full"
          >
            <Heart className="w-5 h-5" />
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-charcoal hover:bg-ivory-subtle rounded-md"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-ivory border-b border-sand/40 px-6 py-6 space-y-4 shadow-elevated">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-base py-2 flex items-center gap-3 ${
                    isActive ? 'text-forest font-semibold' : 'text-charcoal'
                  }`
                }
              >
                <link.icon className="w-5 h-5 text-taupe" />
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="pt-4 border-t border-sand/40 flex flex-col gap-3">
            <Link to="/consultation" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full">
                Book Consultation
              </Button>
            </Link>
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center text-sm font-medium text-charcoal-muted py-2 hover:text-charcoal"
            >
              Sign In / Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
