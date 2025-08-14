'use client';

import LangLink from '@/components/common/LangLink';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
  isExact?: boolean;
}

export default function SidebarLink({
  href,
  icon: Icon,
  children,
  isExact = false,
}: SidebarLinkProps) {
  const pathname = usePathname();

  const isActivePath = () => {
    // Get current language from pathname
    const lang = pathname.split('/')[1] || 'fr';
    const fullHref = `/${lang}${href}`;

    if (isExact || href === '/admin') {
      return pathname === fullHref;
    }
    return pathname.startsWith(fullHref);
  };

  const isActive = isActivePath();

  return (
    <LangLink
      href={href}
      className={`
        flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
        ${
          isActive
            ? 'bg-primary/10 text-primary border-r-2 border-primary'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        }
      `}
    >
      <Icon size={20} className={isActive ? 'text-primary' : 'text-gray-500'} />
      <span className="font-medium">{children}</span>
    </LangLink>
  );
}
