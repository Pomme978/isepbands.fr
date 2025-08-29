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
import Avatar from '../common/Avatar';
import { useRouter, useParams } from 'next/navigation';

interface NavbarProps {
  mode?: 'scroll' | 'static' | 'fixed';
  style?: 'default' | 'transparent';
  className?: string;
}

export default function Navbar({ mode = 'scroll', style = 'default', className }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(mode === 'static' || mode === 'fixed');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { loading: authLoading } = useAuth();
  const { user } = useSession();
  const { signOut } = useAuth();
  const router = useRouter();
  const params = useParams();
  // const t = useI18n(); // TODO: Add internationalization

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

  // Initialize visibility based on mode and scroll position
  useEffect(() => {
    if (mode === 'static' || mode === 'fixed') {
      setIsVisible(true);
      return;
    }

    // For scroll mode, only check after mounted
    if (mounted) {
      const currentScrollY = window.pageYOffset;
      setIsVisible(currentScrollY > 50);
    }
  }, [mode, mounted]);

  // Handle scroll events for scroll mode
  useEffect(() => {
    if (!mounted || mode !== 'scroll') return;

    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;

      if (Math.abs(scrollY - lastScrollY) < 5) {
        ticking = false;
        return;
      }

      // Afficher la navbar dès qu'on scroll au-delà de 50px
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
  }, [lastScrollY, mounted, mode]);

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
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`;
  };

  // Don't render navbar content until mounted, but allow it to render even during auth loading for non-auth users
  const showContent = mounted;

  // Helper function to get display name
  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.email) {
      // Fallback to email formatting if no first/last name
      return user.email.replace(/\b([a-z])/g, (c: string) => c.toUpperCase());
    }
    return '';
  };

  return (
    <>
      {/* Flexbox container that spans full width */}
      <div className={`${getContainerClasses()} ${className || ''}`}>
        {/* Centered navbar with max-width constraint */}
        <header
          className={`w-full rounded-lg backdrop-blur ${style === 'transparent' ? 'bg-transparent' : 'bg-white'}`}
        >
          <nav className="flex items-center justify-between px-4 lg:px-6 py-2 gap-2 lg:gap-8 min-w-0">
            {/* Desktop Navigation */}
            <div className="hidden lg:contents">
              <div className="flex-shrink-0">
                <Logo variant={style === 'transparent' ? 'white' : 'default'} />
              </div>
              <div className="flex-1 flex justify-center min-w-0">
                <NavLinks variant={style === 'transparent' ? 'white' : 'default'} />
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <LanguageSwitcher variant={style === 'transparent' ? 'transparent' : 'default'} />
                <UserMenu variant={style === 'transparent' ? 'white' : 'default'} />
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden flex items-center justify-between w-full min-w-0">
              {/* Page Title */}
              <div className="flex-1 text-left min-w-0">
                <h1
                  className={`text-xl font-bold truncate ${style === 'transparent' ? 'text-white' : 'text-black'}`}
                >
                  ISEPBANDS
                </h1>
              </div>

              {/* Hamburger Button */}
              <div className="flex-shrink-0">
                <Button
                  variant="ghost"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="Toggle menu"
                  className={style === 'transparent' ? 'text-white hover:bg-white/10' : ''}
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
                      {authLoading ? (
                        <div className="h-12 w-full bg-gray-200 animate-pulse rounded"></div>
                      ) : user ? (
                        // Authenticated user menu items (matching desktop UserMenu)
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 px-3 py-3 border-b pb-3">
                            <Avatar
                              src={user?.photoUrl}
                              alt={getDisplayName()}
                              name={getDisplayName()}
                              size="md"
                              className="shadow-lg flex-shrink-0"
                            />
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
                    <div className="h-20 w-full"></div>
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
