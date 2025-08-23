'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import Logo from './Logo';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/locales/client';
import GuitarBodySVG from './GuitarBody';
import { useAuth } from '../../lib/auth-client';

interface NavbarProps {
  mode?: 'scroll' | 'static' | 'fixed';
  className?: string;
}

export default function Navbar({ mode = 'scroll', className }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(mode === 'static' || mode === 'fixed');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { loading: authLoading } = useAuth();
  const t = useI18n();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Si mode static ou fixed, on n'écoute pas le scroll
    if (mode === 'static' || mode === 'fixed') {
      setIsVisible(true);
      return;
    }

    // Mode scroll : comportement existant
    const currentScrollY = window.pageYOffset;
    if (currentScrollY > 50) {
      setIsVisible(true);
    }

    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;

      if (Math.abs(scrollY - lastScrollY) < 5) {
        ticking = false;
        return;
      }

      // Afficher la navbar dès qu'on scroll (même vers le bas)
      if (scrollY > 50) {
        setIsVisible(true);
      } else {
        // Cacher la navbar quand on revient en haut
        setIsVisible(false);
        setIsOpen(false); // Fermer le menu mobile si ouvert
      }

      setLastScrollY(scrollY > 0 ? scrollY : 0);
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    const onScroll = () => requestTick();

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY, mode]);

  // Container classes selon le mode - FLEXBOX APPROACH
  const getContainerClasses = () => {
    const baseClasses = `flex justify-center items-center z-50 w-full max-w-7xl transition-all duration-300 ease-in-out`;
    if (mode === 'static') {
      return `absolute top-3 ${baseClasses} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`;
    }

    if (mode === 'fixed') {
      return `fixed top-3 ${baseClasses} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`;
    }

    // Mode scroll (default)
    return `fixed top-3 ${baseClasses} ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
    }`;
  };

  // Don't render navbar content until auth has loaded to prevent flash
  const showContent = mounted && !authLoading;

  return (
    <>
      {/* Flexbox container that spans full width */}
      <div className={getContainerClasses() + ` ${className || ''}`}>
        {/* Centered navbar with max-width constraint */}
        <header className="w-full rounded-lg backdrop-blur bg-white">
          <nav className="flex items-center justify-between px-4 lg:px-6 py-2 gap-2 lg:gap-8 min-w-0">
            {/* Desktop Navigation */}
            <div className="hidden lg:contents">
              <div className="flex-shrink-0">
                <Logo />
              </div>
              <div className="flex-1 flex justify-center min-w-0">
                <NavLinks />
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <LanguageSwitcher />
                {showContent ? (
                  <UserMenu />
                ) : (
                  <div className="h-10 w-32 animate-pulse bg-gray-200 rounded"></div>
                )}
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden flex items-center justify-between w-full min-w-0">
              {/* Page Title */}
              <div className="flex-1 text-center min-w-0">
                <h1 className="text-lg font-semibold truncate">ISEPBANDS</h1>
              </div>

              {/* Hamburger Button */}
              <div className="flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="Toggle menu"
                  className="h-10 w-10 lg:h-12 lg:w-12"
                >
                  {isOpen ? (
                    <X className="h-5 w-5 lg:h-6 lg:w-6" />
                  ) : (
                    <Menu className="h-5 w-5 lg:h-6 lg:w-6" />
                  )}
                </Button>
              </div>
            </div>
          </nav>

          {/* Mobile Menu Dropdown */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-white/95 backdrop-blur border-t">
              <div className="max-w-md mx-auto px-4 lg:px-6 py-4 space-y-4">
                {/* Navigation Links */}
                <div className="space-y-2">
                  <NavLinks />
                </div>

                {/* User Menu / Auth Buttons */}
                <div className="pt-4 border-t space-y-3">
                  {showContent ? (
                    <UserMenu />
                  ) : (
                    <div className="h-10 w-full animate-pulse bg-gray-200 rounded"></div>
                  )}
                </div>

                {/* Language Switcher */}
                <div className="pt-4 border-t flex justify-center">
                  <div onClick={(e) => e.stopPropagation()}>
                    <LanguageSwitcher />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Invisible spacer for static mode to prevent content overlap */}
      {mode === 'static' && <div className="h-20 md:h-16 pointer-events-none" />}
    </>
  );
}
