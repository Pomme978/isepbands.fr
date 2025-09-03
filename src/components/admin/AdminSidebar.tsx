'use client';

import LangLink from '@/components/common/LangLink';
import Image from 'next/image';
import isepbands_logo from '@/assets/images/logo_bands.png';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isFullAccess?: boolean;
  isRoot?: boolean;
}

interface AdminSidebarProps {
  user?: User;
}
import SidebarLink from './SidebarLink';
import SidebarSection from './SidebarSection';
import AdminUserInfo from './AdminUserInfo';
import {
  Home,
  Activity,
  Users,
  Megaphone,
  Calendar,
  Building2,
  Image as ImageIcon,
  Package,
  Mail,
  ShoppingCart,
  Settings,
  Shield,
  Database,
  Crown,
  Archive,
  Award,
  LucideIcon,
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: LucideIcon;
  isExact?: boolean;
}

interface SidebarSectionData {
  title: string;
  items: SidebarItem[];
}

const SIDEBAR_SECTIONS: SidebarSectionData[] = [
  {
    title: 'Dashboard',
    items: [
      {
        name: 'Overview',
        href: '/admin',
        icon: Home,
        isExact: true,
      },
    ],
  },
  {
    title: 'Content',
    items: [
      {
        name: 'Bands',
        href: '/admin/bands',
        icon: Megaphone,
      },
      {
        name: 'Events',
        href: '/admin/events',
        icon: Calendar,
      },
      {
        name: 'Venues',
        href: '/admin/venues',
        icon: Building2,
      },
      {
        name: 'Media Library',
        href: '/admin/media',
        icon: ImageIcon,
      },
    ],
  },
  {
    title: 'Community',
    items: [
      {
        name: 'Users',
        href: '/admin/users',
        icon: Users,
      },
      {
        name: 'Club Feed',
        href: '/admin/clubfeed',
        icon: Activity,
      },
      {
        name: 'Newsletter & Emails',
        href: '/admin/newsletter',
        icon: Mail,
      },
    ],
  },
  {
    title: 'Operations',
    items: [
      {
        name: 'Inventory',
        href: '/admin/inventory',
        icon: Package,
      },
      {
        name: 'Wishlist',
        href: '/admin/wishlist',
        icon: ShoppingCart,
      },
    ],
  },
  {
    title: 'Administration',
    items: [
      {
        name: 'Board Team',
        href: '/admin/team',
        icon: Crown,
      },
      {
        name: 'Roles & Permissions',
        href: '/admin/roles',
        icon: Shield,
      },
      {
        name: 'Badges',
        href: '/admin/badges',
        icon: Award,
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        name: 'Settings',
        href: '/admin/settings',
        icon: Settings,
      },
      {
        name: 'Database',
        href: '/admin/database',
        icon: Database,
      },
      {
        name: 'Archives',
        href: '/admin/archive',
        icon: Archive,
      },
    ],
  },
];

export default function AdminSidebar({ user }: AdminSidebarProps = {}) {
  return (
    <div className="w-64 bg-white shadow-lg flex flex-col h-screen">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <LangLink href="/" className="flex items-center space-x-3">
          <Image
            src={isepbands_logo}
            alt="ISEPBANDS Logo"
            width={40}
            height={40}
            className="object-contain w-10 h-10"
          />
          <div>
            <h1 className="text-xl font-bold text-primary">ISEPBANDS</h1>
            <p className="text-base md:text-sm text-muted-foreground">Admin Panel</p>
          </div>
        </LangLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {SIDEBAR_SECTIONS.map((section) => (
          <SidebarSection key={section.title} title={section.title}>
            {section.items.map((item) => (
              <SidebarLink key={item.href} href={item.href} icon={item.icon} isExact={item.isExact}>
                {item.name}
              </SidebarLink>
            ))}
          </SidebarSection>
        ))}
      </nav>

      {/* User Info Section */}
      <AdminUserInfo user={user} />
    </div>
  );
}
