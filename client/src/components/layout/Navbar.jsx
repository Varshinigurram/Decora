import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Heart,
  Compass,
  Sliders,
  Layout,
  Layers,
  Menu,
  X,
  User,
  Home,
  MessageSquare,
} from 'lucide-react';
import Button from '../common/Button';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const primaryNavLinks = [
    { label: 'Home', path: '/', icon: Home, exact: true },
    { label: 'Inspiration', path: '/inspiration', icon: Compass },
    { label: 'Catalog', path: '/catalog', icon: Layers },
    { label: 'Customizer', path: '/customizer', icon: Sliders },
    { label: 'Room Planner', path: '/room-planner', icon: Layout },
    { label: 'Design Boards', path: '/boards', icon: Layers },
  ];

  const isLinkActive = (path, exact) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-md border-b border-sand/40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Identity Wordmark */}
        <Link to="/" className="flex items-center gap-2 group shrink-0" aria-label="Décora Homepage">
          <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-wider text-charcoal group-hover:text-forest transition-colors">
            DÉCORA
          </span>
          <span className="text-[10px] uppercase tracking-widest text-taupe font-medium mt-1">
            Studio
          </span>
        </Link>

        {/* Desktop Primary Navigation */}
        <nav className="hidden lg:flex items-center space-x-7" aria-label="Main Navigation">
          {primaryNavLinks.map((link) => {
            const active = isLinkActive(link.path, link.exact);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm tracking-wide transition-all duration-150 py-1 border-b-2 ${
                  active
                    ? 'text-forest border-forest font-semibold'
                    : 'text-charcoal-muted border-transparent hover:text-charcoal hover:border-sand'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons & Utilities */}
        <div className="hidden lg:flex items-center space-x-4 shrink-0">
          <Link
            to="/wishlist"
            className={`p-2 rounded-full transition-colors relative ${
              isLinkActive('/wishlist', true)
                ? 'text-forest bg-ivory-subtle'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-ivory-subtle'
            }`}
            title="My Saved Items"
            aria-label="Wishlist (Saved Items)"
          >
            <Heart className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-forest" />
          </Link>

          <Link to="/consultation">
            <Button
              variant={isLinkActive('/consultation', true) ? 'primary' : 'secondary'}
              size="sm"
            >
              Consultation
            </Button>
          </Link>

          <Link
            to="/login"
            className={`p-2 rounded-full transition-colors ${
              isLinkActive('/login', true) || isLinkActive('/register', true)
                ? 'text-forest bg-ivory-subtle'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-ivory-subtle'
            }`}
            title="Account & Login"
            aria-label="User Account"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>

        {/* Tablet / Mobile Navigation Actions */}
        <div className="flex lg:hidden items-center space-x-2">
          <Link
            to="/wishlist"
            className="p-2 text-charcoal-muted hover:text-charcoal hover:bg-ivory-subtle rounded-full"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
          </Link>
          <Link
            to="/consultation"
            className="hidden sm:inline-flex"
          >
            <Button variant="secondary" size="sm">
              Consultation
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-charcoal hover:bg-ivory-subtle rounded-md transition-colors"
            aria-label="Toggle navigation drawer"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-ivory border-b border-sand/40 px-6 py-6 space-y-5 shadow-elevated">
          <nav className="flex flex-col space-y-2.5" aria-label="Mobile Navigation">
            {primaryNavLinks.map((link) => {
              const active = isLinkActive(link.path, link.exact);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base py-2.5 px-3 rounded flex items-center gap-3 transition-colors ${
                    active
                      ? 'bg-white text-forest font-semibold shadow-subtle border border-sand/40'
                      : 'text-charcoal hover:bg-ivory-subtle'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <link.icon className={`w-5 h-5 ${active ? 'text-forest' : 'text-taupe'}`} />
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base py-2.5 px-3 rounded flex items-center gap-3 text-charcoal hover:bg-ivory-subtle"
            >
              <Heart className="w-5 h-5 text-taupe" />
              Wishlist
            </Link>
          </nav>

          <div className="pt-4 border-t border-sand/40 flex flex-col gap-3">
            <Link to="/consultation" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full">
                Book Design Consultation
              </Button>
            </Link>
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center text-sm font-medium text-charcoal py-2 hover:text-forest"
            >
              Sign In / Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
