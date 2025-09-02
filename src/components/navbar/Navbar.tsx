'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import Logo from './Logo';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';
import { Button } from '@/components/ui/button';
import { useAuth, useSession } from '../../lib/auth-client';
import Avatar from '../common/Avatar';
import { useRouter, useParams } from 'next/navigation';
import LangLink from '@/components/common/LangLink';

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  // Initialize visibility based on mode and scroll position
  useEffect(() => {
    if (mode === 'static' || mode === 'fixed') {
      setIsVisible(true);
      return;
    }

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

      if (scrollY > 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsOpen(false);
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
    const baseClasses = `flex justify-center z-[150] items-center w-full max-w-7xl transition-all duration-300 ease-in-out`;

    if (mode === 'static') {
      return `absolute md:top-3 ${baseClasses} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`;
    }

    if (mode === 'fixed') {
      return `fixed md:top-3 ${baseClasses} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`;
    }

    // Mode scroll (default)
    return `fixed md:top-3 ${baseClasses} ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`;
  };

  // Helper function to get display name
  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.email) {
      return user.email.replace(/\b([a-z])/g, (c: string) => c.toUpperCase());
    }
    return '';
  };

  // Check if user has admin permissions
  const isAdmin =
    user &&
    (user.isRoot ||
      user.isFullAccess ||
      user.roles?.some((userRole) => userRole.role.weight >= 70));

  return (
    <>
      {/* Main Navbar Container */}
      <div className={`${getContainerClasses()} ${className || ''}`}>
        <header
          className={`w-full z-[300] rounded-lg backdrop-blur md:mx-0 mx-2 mt-2 md:mt-0 ${
            style === 'transparent' ? 'bg-black/60 lg:bg-transparent md:bg-white' : 'bg-white'
          }`}
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
            <div className="lg:hidden flex items-center justify-between w-full min-w-0 z-[300]">
              {/* Page Title */}
              <div className="flex-1 text-left min-w-0">
                <LangLink href="/" className="block">
                  <h1
                    className={`text-xl font-bold truncate ${
                      style === 'transparent' ? 'text-white' : 'text-black'
                    }`}
                  >
                    ISEPBANDS
                  </h1>
                </LangLink>
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
        </header>
      </div>

      {/* Spacer for static mode */}
      {mode === 'static' && <div className="h-20 md:h-16 pointer-events-none" />}

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden fixed top-10 left-0 right-0 bottom-0 z-[50] transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Menu Content */}
        <div
          className={`absolute top-0 left-0 right-0 mx-2 transition-all duration-300 ease-in-out ${
            isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={` pt-5 rounded-b-lg shadow-xl ${
              style === 'transparent' ? 'bg-black/90 border-none' : 'bg-white'
            }`}
          >
            <div className="px-4 py-4 space-y-4">
              {/* Navigation Links */}
              <div className="space-y-1">
                <NavLinks variant={style === 'transparent' ? 'white' : 'default'} />
              </div>

              {/* User Section */}
              <div className={`border-t ${style === 'transparent' ? 'border-white/10' : ''}`}>
                {mounted && !authLoading ? (
                  user ? (
                    <div className="space-y-3">
                      {/* User Profile */}
                      <div
                        className={`flex items-center justify-center w-full h-full gap-3 px-3 py-3 border-b ${style === 'transparent' ? 'border-white/10' : 'border-gray-200'}`}
                      >
                        <Avatar
                          src={user?.photoUrl}
                          alt={getDisplayName()}
                          name={getDisplayName()}
                          size="md"
                          className="flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div
                            className={`font-semibold truncate ${style === 'transparent' ? 'text-white' : 'text-gray-900'}`}
                          >
                            {getDisplayName()}
                          </div>
                          {user.band && (
                            <div
                              className={`text-xs truncate ${style === 'transparent' ? 'text-white/70' : 'text-gray-500'}`}
                            >
                              {user.band}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="space-y-1">
                        <button
                          onClick={handleMobileProfileClick}
                          className={`w-full text-left px-3 py-2 rounded text-sm ${
                            style === 'transparent'
                              ? 'text-white hover:bg-white/10'
                              : 'text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          Mon profil
                        </button>
                        <button
                          onClick={handleMobileGroupSpaceClick}
                          className={`w-full text-left px-3 py-2 rounded text-sm ${
                            style === 'transparent'
                              ? 'text-white hover:bg-white/10'
                              : 'text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          Mon espace groupe
                        </button>
                        {isAdmin && (
                          <button
                            onClick={handleMobileAdminClick}
                            className={`w-full text-left px-3 py-2 rounded text-sm ${
                              style === 'transparent'
                                ? 'text-white hover:bg-white/10'
                                : 'text-gray-900 hover:bg-gray-100'
                            }`}
                          >
                            Tableau de bord admin
                          </button>
                        )}
                        <button
                          onClick={handleMobileSettingsClick}
                          className={`w-full text-left px-3 py-2 rounded text-sm ${
                            style === 'transparent'
                              ? 'text-white hover:bg-white/10'
                              : 'text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          Paramètres
                        </button>
                      </div>

                      {/* Sign out */}
                      <div
                        className={`border-t pt-3 ${style === 'transparent' ? 'border-white/10' : 'border-gray-200'}`}
                      >
                        <button
                          onClick={handleMobileSignOut}
                          className={`w-full text-left px-3 py-2 rounded text-sm ${
                            style === 'transparent'
                              ? 'text-red-400 hover:bg-white/10'
                              : 'text-red-600 hover:bg-gray-100'
                          }`}
                        >
                          Se déconnecter
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleMobileLogin}
                      className={`w-full px-4 py-3 rounded font-medium ${
                        style === 'transparent'
                          ? 'bg-white/20 text-white hover:bg-white/30'
                          : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                    >
                      Se connecter
                    </button>
                  )
                ) : (
                  <div className="h-12 w-full bg-gray-200 animate-pulse rounded" />
                )}
              </div>

              {/* Language Switcher */}
              <div
                className={`border-t pt-4 flex justify-center ${style === 'transparent' ? 'border-white/10' : 'border-gray-200'}`}
              >
                <LanguageSwitcher variant={style === 'transparent' ? 'transparent' : 'default'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
