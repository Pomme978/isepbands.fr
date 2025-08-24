'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import Logo from './Logo';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/locales/client';
import { useAuth, useSession } from '../../lib/auth-client';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useRouter, useParams } from 'next/navigation';

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
  const { user } = useSession();
  const { signOut } = useAuth();
  const router = useRouter();
  const params = useParams();
  const t = useI18n();

  // Get the current language from params
  const currentLang = params?.lang || params?.locale || 'fr';

  // Mobile menu handlers
  const handleMobileProfileClick = () => {
    router.push(`/${currentLang}/profile`);
    setIsOpen(false);
  };

  const handleMobileGroupSpaceClick = () => {
    router.push(`/${currentLang}/group`);
    setIsOpen(false);
  };

  const handleMobileAdminClick = () => {
    router.push(`/${currentLang}/admin`);
    setIsOpen(false);
  };

  const handleMobileSettingsClick = () => {
    router.push(`/${currentLang}/profile/settings`);
    setIsOpen(false);
  };

  const handleMobileSignOut = () => {
    signOut(() => router.push(`/${currentLang}/login`));
    setIsOpen(false);
  };

  const handleMobileLogin = () => {
    router.push(`/${currentLang}/login`);
    setIsOpen(false);
  };

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

  // Container classes selon le mode
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

  // Helper function to format display name like in UserMenu
  const getDisplayName = () => {
    if (!user?.email) return '';
    return user.email.replace(/\b([a-z])/g, (c: string) => c.toUpperCase());
  };

  return (
    <>
      {/* Flexbox container that spans full width */}
      <div className={`${getContainerClasses()} ${className || ''}`}>
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
              <div className="flex-1 text-left min-w-0">
                <h1 className="text-xl font-bold truncate">ISEPBANDS</h1>
              </div>

              {/* Hamburger Button */}
              <div className="flex-shrink-0">
                <Button
                  variant="ghost"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="Toggle menu"
                  className=""
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
              </div>
            </div>
          </nav>

          {/* Mobile Menu Dropdown */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-white/95 backdrop-blur border-t">
              <div className="max-w-md mx-auto px-4 lg:px-6 py-4 space-y-4">
                {/* Navigation Links */}
                <div className="space-y-2">
                  <NavLinks />
                </div>

                {/* User Menu / Auth Buttons - Mobile Version */}
                <div className="pt-4 border-t">
                  {showContent ? (
                    <div className="w-full space-y-3">
                      {user ? (
                        // Authenticated user menu items (matching desktop UserMenu)
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 px-3 py-3 border-b pb-3">
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarFallback className="text-sm">
                                {getDisplayName()[0] || user.email[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 truncate">
                                {getDisplayName()}
                              </div>
                              {user.band && (
                                <div className="text-xs text-gray-500 truncate">{user.band}</div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={handleMobileProfileClick}
                            className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm"
                          >
                            Mon profil
                          </button>
                          <button
                            onClick={handleMobileGroupSpaceClick}
                            className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm"
                          >
                            Mon espace groupe
                          </button>
                          <button
                            onClick={handleMobileAdminClick}
                            className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm"
                          >
                            Tableau de bord admin
                          </button>
                          <button
                            onClick={handleMobileSettingsClick}
                            className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm"
                          >
                            Paramètres
                          </button>
                          <div className="border-t pt-2">
                            <button
                              onClick={handleMobileSignOut}
                              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm text-red-600"
                            >
                              Se déconnecter
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Non-authenticated user button (matching desktop UserMenu)
                        <div className="space-y-2">
                          <button
                            onClick={handleMobileLogin}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                          >
                            Se connecter
                          </button>
                        </div>
                      )}
                    </div>
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
