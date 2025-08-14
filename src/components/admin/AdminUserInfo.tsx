'use client';

import LangLink from '@/components/common/LangLink';
import { LogOut, User, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface AdminUserInfoProps {
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
    initials?: string;
  };
}

export default function AdminUserInfo({
  user = {
    name: 'Admin User',
    email: 'admin@isepbands.fr',
    role: 'Administrateur',
    initials: 'AD',
  },
}: AdminUserInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-4 border-t border-gray-200">
      {/* User Info Header */}
      <div
        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-white">{user.initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
          <p className="text-xs text-gray-500 truncate">{user.role}</p>
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
            href="/admin/profile"
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <User size={16} />
            <span>My Profile</span>
          </LangLink>

          <LangLink
            href="/logout"
            className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </LangLink>
        </div>
      )}
    </div>
  );
}
