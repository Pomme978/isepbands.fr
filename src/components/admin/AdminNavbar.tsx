'use client';

import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Settings,
  Home,
  Users,
  Calendar,
  Database,
  Megaphone,
  Building2,
  FileText,
  Image,
  Send,
  Bell,
  BarChart3,
  TrendingUp,
  Crown,
  Shield,
  Archive,
} from 'lucide-react';
import LangLink from '@/components/common/LangLink';
import Avatar from '@/components/common/Avatar';
import { Button } from '@/components/ui/button';
import { useAuth, useSession } from '@/lib/auth-client';
import { useRouter, useParams, usePathname } from 'next/navigation';

interface AdminNavbarProps {
  className?: string;
}

const ADMIN_SECTIONS = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin', icon: Home, isExact: true },
      { name: 'Club Feed', href: '/admin/clubfeed', icon: Megaphone },
    ],
  },
  {
    title: 'Content Management',
    items: [
      { name: 'Users', href: '/admin/users', icon: Users },
      { name: 'Bands', href: '/admin/bands', icon: Megaphone },
      { name: 'Events', href: '/admin/events', icon: Calendar },
      { name: 'Venues', href: '/admin/venues', icon: Building2 },
      { name: 'Pages Content', href: '/admin/pages', icon: FileText },
      { name: 'Media Library', href: '/admin/media', icon: Image },
    ],
  },
  {
    title: 'Communication',
    items: [
      { name: 'Newsletter', href: '/admin/newsletter', icon: Send },
      { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    ],
  },
  {
    title: 'Reports',
    items: [
      { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
      { name: 'Statistics', href: '/admin/statistics', icon: TrendingUp },
    ],
  },
  {
    title: 'Board Management',
    items: [
      { name: 'Board Members', href: '/admin/team', icon: Crown },
      { name: 'Roles & Permissions', href: '/admin/roles', icon: Shield },
    ],
  },
  {
    title: 'System',
    items: [
      { name: 'Settings', href: '/admin/settings', icon: Settings },
      { name: 'Database', href: '/admin/database', icon: Database },
      { name: 'Archives', href: '/admin/archive', icon: Archive },
    ],
  },
];

export default function AdminNavbar({ className }: AdminNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { loading: authLoading } = useAuth();
  const { user } = useSession();
  const { signOut } = useAuth();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const currentLang = params?.lang || 'fr';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Block body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Helper function to get display name
  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.email) {
      return user.email.replace(/\b([a-z])/g, (c: string) => c.toUpperCase());
    }
    return 'Admin';
  };

  const handleMobileSignOut = () => {
    router.push(`/${currentLang}/logout`);
    setIsOpen(false);
  };

  const handleMobileNavClick = (href: string) => {
    router.push(`/${currentLang}${href}`);
    setIsOpen(false);
  };

  const isActiveRoute = (href: string, isExact = false) => {
    if (isExact) {
      return pathname === `/${currentLang}${href}`;
    }
    return pathname.startsWith(`/${currentLang}${href}`);
  };

  const showContent = mounted;

  return (
    <div className={`w-full bg-white shadow-sm border-b ${className || ''}`}>
      <header className="max-w-full mx-auto">
        <nav className="flex items-center justify-between px-4 lg:px-6 py-3 gap-2 lg:gap-4">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex-shrink-0">
              <LangLink href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IB</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-primary">Admin Panel</h1>
                </div>
              </LangLink>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {ADMIN_SECTIONS.map((section) =>
                section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActiveRoute(item.href, item.isExact);
                  return (
                    <LangLink
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base md:text-sm font-medium transition-colors ${
                        active ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </LangLink>
                  );
                }),
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              {showContent && user && (
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={user?.photoUrl}
                    alt={getDisplayName()}
                    name={getDisplayName()}
                    size="sm"
                    className="shadow-sm flex-shrink-0"
                  />
                  <div className="text-right">
                    <div className="text-base md:text-sm font-medium text-gray-900">
                      {getDisplayName()}
                    </div>
                    <div className="text-sm md:text-xs text-gray-500">Admin</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex-shrink-0">
              <LangLink href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IB</span>
                </div>
                <span className="text-lg font-bold text-primary">Admin</span>
              </LangLink>
            </div>

            {/* Hamburger */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                className="p-2"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu - Fixed overlay */}
      <div
        className={`lg:hidden fixed left-0 right-0 top-[65px] bottom-0 z-40 bg-white transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="px-4 py-4 space-y-4 h-full flex flex-col overflow-y-auto">
          {/* Navigation Sections */}
          <div className="flex-1 space-y-4">
            {ADMIN_SECTIONS.map((section) => (
              <div key={section.title}>
                <h3 className="text-base md:text-sm font-semibold text-gray-900 mb-2 px-3">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActiveRoute(item.href, item.isExact);
                    return (
                      <button
                        key={item.href}
                        onClick={() => handleMobileNavClick(item.href)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-base md:text-sm ${
                          active ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* User Menu + Footer - Fixed at bottom */}
          <div className="border-t pt-4 space-y-4 flex-shrink-0">
            {showContent && user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-3 border-b pb-3">
                  <Avatar
                    src={user?.photoUrl}
                    alt={getDisplayName()}
                    name={getDisplayName()}
                    size="md"
                    className="flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate text-base md:text-sm">
                      {getDisplayName()}
                    </div>
                    <div className="text-sm md:text-xs text-gray-500">Administrateur</div>
                  </div>
                </div>
                <button
                  onClick={() => handleMobileNavClick('/profile')}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-base md:text-sm"
                >
                  Mon Profil
                </button>
                <button
                  onClick={() => handleMobileNavClick('/')}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-base md:text-sm"
                >
                  Retour au Site
                </button>
                <div className="border-t pt-2">
                  <button
                    onClick={handleMobileSignOut}
                    className="w-full text-left px-3 py-2 rounded hover:bg-red-50 text-base md:text-sm text-red-600"
                  >
                    Se Déconnecter
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  onClick={() => handleMobileNavClick('/login')}
                  className="w-full text-base md:text-sm"
                >
                  Se connecter
                </Button>
              </div>
            )}

            {/* Footer */}
            <div className="border-t pt-4">
              <div className="flex flex-col items-center text-xs text-gray-500 space-y-1">
                <p>© {new Date().getFullYear()} gngn. All rights reserved.</p>
                <div className="flex space-x-2">
                  <span>Version 1.0.0</span>
                  <span>•</span>
                  <span>Admin Panel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
