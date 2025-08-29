'use client';

import LangLink from '@/components/common/LangLink';

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
  // Main sections
  Home,
  Activity,
  Newspaper,

  // Content Management
  Users,
  UserPlus,
  Megaphone,
  Calendar,
  Building2,
  FileText,
  Image,

  // Newsletter & Communication
  Send,
  MessageSquare,
  Bell,

  // Analytics & Reports
  BarChart3,
  TrendingUp,

  // Administration
  Settings,
  Shield,
  UserCog,
  Database,
  Crown,
  Archive,
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
    title: 'Overview',
    items: [
      {
        name: 'Dashboard',
        href: '/admin',
        icon: Home,
        isExact: true,
      },
      {
        name: 'Club Feed',
        href: '/admin/clubfeed',
        icon: Newspaper,
      },
    ],
  },
  {
    title: 'Content Management',
    items: [
      {
        name: 'Users',
        href: '/admin/users',
        icon: Users,
      },
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
        name: 'Pages Content',
        href: '/admin/pages',
        icon: FileText,
      },
      {
        name: 'Media Library',
        href: '/admin/media',
        icon: Image,
      },
    ],
  },
  {
    title: 'Communication',
    items: [
      {
        name: 'Newsletter',
        href: '/admin/newsletter',
        icon: Send,
      },
      {
        name: 'Notifications',
        href: '/admin/notifications',
        icon: Bell,
      },
    ],
  },
  {
    title: 'Reports',
    items: [
      {
        name: 'Reports',
        href: '/admin/reports',
        icon: BarChart3,
      },
      {
        name: 'Statistics',
        href: '/admin/statistics',
        icon: TrendingUp,
      },
    ],
  },
  {
    title: 'Board Management',
    items: [
      {
        name: 'Board Members',
        href: '/admin/team',
        icon: Crown,
      },
      {
        name: 'Roles & Permissions',
        href: '/admin/roles',
        icon: Shield,
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
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">IB</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">ISEP Bands</h1>
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
