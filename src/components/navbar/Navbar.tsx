'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import Logo from './Logo';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/locales/client';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const t = useI18n();

  useEffect(() => {
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
  }, [lastScrollY]);

  return (
    <header
      className={`fixed left-1/2 transform -translate-x-1/2 top-4 rounded-lg z-50 backdrop-blur bg-white/98 shadow-lg border transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      } w-[calc(100%-2rem)] max-w-7xl`}
    >
      <nav className="flex items-center justify-between px-6 py-2 gap-8">
        {/* Desktop Navigation */}
        <div className="hidden md:contents">
          <Logo />
          <div className="flex-1 flex justify-center">
            <NavLinks />
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <UserMenu />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between w-full">
          {/* Page Title */}
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold">ISEPBANDS</h1>
          </div>

          {/* Hamburger Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="h-10 w-10"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/95 backdrop-blur border-t">
          <div className="max-w-md mx-auto px-6 py-4 space-y-4">
            {/* Navigation Links */}
            <div className="space-y-2">
              <NavLinks />
            </div>

            {/* User Menu / Auth Buttons */}
            <div className="pt-4 border-t space-y-3">
              <UserMenu />
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
  );
}
