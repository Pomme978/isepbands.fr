'use client';

import LangLink from '@/components/common/LangLink';
import Avatar from '@/components/common/Avatar';
import { Button } from '@/components/ui/button';
import { LogOut, User, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-client';
import { getPrimaryRoleName } from '@/utils/roleUtils';
import { useRouter, useParams } from 'next/navigation';

interface AdminUserInfoProps {
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
    pronouns?: string;
    isFullAccess?: boolean;
    isRoot?: boolean;
    roles?: Array<{
      role: {
        id: number;
        name: string;
        nameFrMale: string;
        nameFrFemale: string;
        nameEnMale: string;
        nameEnFemale: string;
        weight: number;
        isCore: boolean;
      };
    }>;
  };
}

export default function AdminUserInfo({ user }: AdminUserInfoProps) {
  const { signOut } = useAuth();
  const router = useRouter();
  const params = useParams();
  const lang = typeof params?.lang === 'string' ? params.lang : 'fr';

  // Get display name from first/last name, fallback to formatted email
  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : (user?.email || '').replace(/\b([a-z])/g, (c: string) => c.toUpperCase());

  // Determine role display using utils
  const roleDisplay = user?.isRoot
    ? 'Root Admin'
    : user?.roles && user.roles.length > 0
      ? getPrimaryRoleName(user.roles, user.pronouns, 'fr')
      : 'Member';

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-4 border-t border-gray-200">
      {/* User Info Header */}
      <div
        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Avatar
          src={user?.photoUrl}
          alt={displayName}
          name={displayName}
          size="sm"
          className="shadow-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
          <p className="text-xs text-gray-500 truncate">{roleDisplay}</p>
        </div>
        <ChevronUp
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Expanded Menu */}
      {isExpanded && (
        <div className="mt-3 space-y-1">
          <LangLink
            href="/profile"
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <User size={16} />
            <span>My Profile</span>
          </LangLink>

          <Button
            onClick={() => signOut(() => router.push(`/${lang}/login`))}
            variant="ghost"
            className="w-full justify-start space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </Button>
        </div>
      )}
    </div>
  );
}
