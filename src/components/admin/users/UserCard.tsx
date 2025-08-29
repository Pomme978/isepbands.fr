'use client';

import LangLink from '@/components/common/LangLink';
import { Edit, Mail, User, Calendar, Clock } from 'lucide-react';
import ViewProfileButton from '../common/ViewProfileButton';
import Avatar from '@/components/common/Avatar';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  promotion: string;
  role: string;
  joinDate: string;
  status:
    | 'current'
    | 'former'
    | 'pending'
    | 'graduated'
    | 'refused'
    | 'suspended'
    | 'deleted'
    | 'archived';
  age?: number;
  instruments?: string[];
  groups?: string[];
  badges?: string[];
}

interface UserCardProps {
  user: User;
  currentUserId?: string;
  onReviewRequest?: (userId: string) => void;
  onRestore?: (userId: string) => void;
}

export default function UserCard({
  user,
  currentUserId,
  onReviewRequest,
  onRestore,
}: UserCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-green-100 text-green-800';
      case 'former':
        return 'bg-gray-100 text-gray-800';
      case 'graduated':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refused':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-orange-100 text-orange-800';
      case 'deleted':
        return 'bg-gray-100 text-gray-800';
      case 'archived':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    if (role === 'President') return 'text-purple-600';
    if (role === 'Vice-President') return 'text-blue-600';
    if (['Secretary', 'Treasurer', 'Communications'].includes(role)) return 'text-orange-600';
    return 'text-gray-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-4 flex-1">
        {/* Avatar */}
        <Avatar
          src={user.avatar}
          alt={`${user.firstName} ${user.lastName}`}
          name={`${user.firstName} ${user.lastName}`}
          size="md"
        />

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {user.firstName} {user.lastName}
              {currentUserId === user.id && (
                <span className="text-sm font-normal text-blue-600 ml-2">(moi)</span>
              )}
            </h3>
            <span className="text-sm font-medium text-gray-600">{user.promotion}</span>
            <span className={`text-sm font-medium ${getRoleColor(user.role)}`}>{user.role}</span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              {user.email}
            </span>
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              Joined: {formatDate(user.joinDate)}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}
        >
          {user.status === 'current'
            ? 'Active'
            : user.status === 'pending'
              ? 'Pending'
              : user.status === 'graduated'
                ? 'Graduated'
                : user.status === 'refused'
                  ? 'Refused'
                  : user.status === 'suspended'
                    ? 'Suspended'
                    : user.status === 'deleted'
                      ? 'Deleted'
                      : 'Former'}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 ml-4">
        {user.status === 'pending' ? (
          <>
            <button
              onClick={() => onReviewRequest?.(user.id)}
              className="inline-flex items-center px-3 py-1 text-sm bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
            >
              <Clock className="w-3 h-3 mr-1" />
              Review
            </button>
            <LangLink
              href={`/admin/users/${user.id}`}
              className="inline-flex items-center px-3 py-1 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </LangLink>
          </>
        ) : user.status === 'refused' || user.status === 'suspended' ? (
          <>
            <LangLink
              href={`/admin/users/${user.id}`}
              className="inline-flex items-center px-3 py-1 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </LangLink>
            <button
              onClick={() => onRestore?.(user.id)}
              className="inline-flex items-center px-3 py-1 text-sm bg-green-100 border border-green-300 text-green-800 rounded-md hover:bg-green-200 transition-colors"
            >
              Restore
            </button>
          </>
        ) : (
          <>
            <LangLink
              href={`/admin/users/${user.id}`}
              className="inline-flex items-center px-3 py-1 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </LangLink>
            <ViewProfileButton userId={user.id} variant="button" className="px-3 py-1 text-sm" />
          </>
        )}
      </div>
    </div>
  );
}
