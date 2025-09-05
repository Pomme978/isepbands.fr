'use client';

import LangLink from '@/components/common/LangLink';
import { Edit, Mail, User, Calendar, Clock, RotateCcw, Eye } from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import AdminButton from '../common/AdminButton';
import { useRouter } from 'next/navigation';

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
  emailVerified?: boolean;
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
  const router = useRouter();
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

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInYears > 0) {
      return `il y a ${diffInYears} an${diffInYears > 1 ? 's' : ''}`;
    } else if (diffInMonths > 0) {
      return `il y a ${diffInMonths} mois`;
    } else if (diffInDays > 0) {
      return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    } else {
      return "aujourd'hui";
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <Avatar
          src={user.avatar}
          alt={`${user.firstName} ${user.lastName}`}
          name={`${user.firstName} ${user.lastName}`}
          size="md"
          className="flex-shrink-0"
        />

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {user.firstName} {user.lastName}
                {currentUserId === user.id && (
                  <span className="text-sm font-normal text-blue-600 ml-2">(moi)</span>
                )}
              </h3>
              <span className="text-sm font-medium text-gray-600 hidden sm:inline">
                {user.promotion}
              </span>
              <span className={`text-sm font-medium ${getRoleColor(user.role)} hidden sm:inline`}>
                {user.role}
              </span>
            </div>

            {/* Status Badge - Hidden on desktop, shown on mobile */}
            <div className="flex items-center sm:hidden">
              <div className="flex items-center space-x-1">
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)} flex-shrink-0`}
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
                {user.status === 'current' && (
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 text-center ${
                      user.emailVerified
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {user.emailVerified ? 'Email vérifié' : 'Email non vérifié'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile: Show promotion and role */}
          <div className="flex items-center space-x-3 mb-2 sm:hidden">
            <span className="text-sm font-medium text-gray-600">{user.promotion}</span>
            <span className={`text-sm font-medium ${getRoleColor(user.role)}`}>{user.role}</span>
          </div>

          {/* Actions - Mobile: Above email/date */}
          <div className="flex flex-wrap items-center gap-2 mb-2 sm:hidden">
            {user.status === 'pending' ? (
              <>
                <AdminButton
                  onClick={() => onReviewRequest?.(user.id)}
                  variant="warning"
                  size="xs"
                  icon={Clock}
                >
                  Review
                </AdminButton>
                <AdminButton
                  onClick={() => router.push(`/admin/users/${user.id}`)}
                  variant="secondary"
                  size="xs"
                  icon={Edit}
                >
                  Edit
                </AdminButton>
              </>
            ) : user.status === 'refused' || user.status === 'suspended' ? (
              <>
                <AdminButton
                  onClick={() => router.push(`/admin/users/${user.id}`)}
                  variant="secondary"
                  size="xs"
                  icon={Edit}
                >
                  Edit
                </AdminButton>
                <AdminButton
                  onClick={() => onRestore?.(user.id)}
                  variant="success"
                  size="xs"
                  icon={RotateCcw}
                >
                  Restore
                </AdminButton>
              </>
            ) : (
              <>
                <AdminButton
                  onClick={() => router.push(`/admin/users/${user.id}`)}
                  variant="secondary"
                  size="xs"
                  icon={Edit}
                >
                  Edit
                </AdminButton>
                <AdminButton
                  onClick={() => window.open(`/profile/${user.id}`, '_blank')}
                  variant="secondary"
                  size="xs"
                  icon={Eye}
                >
                  View Profile
                </AdminButton>
              </>
            )}
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-sm text-gray-500">
            <span className="flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              <span className="truncate">{user.email}</span>
            </span>
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              Joined: {formatDate(user.joinDate)} ({getTimeAgo(user.joinDate)})
            </span>
          </div>
        </div>

        {/* Status Badge & Actions - Desktop: Right side */}
        <div className="hidden sm:flex items-center space-x-3 flex-shrink-0">
          {/* Status Badge - Desktop */}
          <div className="flex items-center space-x-1">
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)} flex-shrink-0`}
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
            {user.status === 'current' && (
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                  user.emailVerified
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {user.emailVerified ? 'Email vérifié' : 'Email non vérifié'}
              </div>
            )}
          </div>

          {/* Actions */}
          {user.status === 'pending' ? (
            <>
              <AdminButton
                onClick={() => onReviewRequest?.(user.id)}
                variant="warning"
                size="sm"
                icon={Clock}
              >
                Review
              </AdminButton>
              <AdminButton
                onClick={() => router.push(`/admin/users/${user.id}`)}
                variant="secondary"
                size="sm"
                icon={Edit}
              >
                Edit
              </AdminButton>
            </>
          ) : user.status === 'refused' || user.status === 'suspended' ? (
            <>
              <AdminButton
                onClick={() => router.push(`/admin/users/${user.id}`)}
                variant="secondary"
                size="sm"
                icon={Edit}
              >
                Edit
              </AdminButton>
              <AdminButton
                onClick={() => onRestore?.(user.id)}
                variant="success"
                size="sm"
                icon={RotateCcw}
              >
                Restore
              </AdminButton>
            </>
          ) : (
            <>
              <AdminButton
                onClick={() => router.push(`/admin/users/${user.id}`)}
                variant="secondary"
                size="sm"
                icon={Edit}
              >
                Edit
              </AdminButton>
              <AdminButton
                onClick={() => window.open(`/profile/${user.id}`, '_blank')}
                variant="secondary"
                size="sm"
                icon={Eye}
              >
                View Profile
              </AdminButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
