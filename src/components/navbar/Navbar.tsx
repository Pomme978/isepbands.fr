'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import Logo from './Logo';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/locales/client';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useI18n();

  return (
    <header className="relative left-0 pt-1 pb-1 top-4 rounded-lg z-50 backdrop-blur bg-white">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2 gap-8">
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
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur border-b shadow-lg">
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
      )}
    </header>
  );
}
