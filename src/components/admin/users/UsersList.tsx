'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminExpandableSection from '../common/AdminExpandableSection';
import UserCard from './UserCard';
import { calculateAge } from '@/utils/schoolUtils';
import { getPrimaryRoleName } from '@/utils/roleUtils';
import Loading from '@/components/ui/Loading';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  promotion: string;
  birthDate: string;
  status: 'CURRENT' | 'FORMER' | 'GRADUATED' | 'PENDING' | 'REFUSED' | 'DELETED';
  photoUrl?: string;
  createdAt: string;
  isOutOfSchool: boolean;
  pronouns?: string;
  biography?: string;
  phone?: string;
  instruments: Array<{
    name: string;
    skillLevel: string;
    yearsPlaying?: number;
    isPrimary: boolean;
  }>;
  roles: Array<{
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
  groups: Array<{
    id: number;
    name: string;
    role?: string;
    isAdmin: boolean;
  }>;
  badges: string[];
}

interface UsersApiResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

interface UsersListProps {
  filters: {
    search: string;
    sortBy: string;
    memberStatus: string;
    dateSort: string;
  };
  refreshTrigger?: number; // Add refresh trigger
}

export default function UsersList({ filters, refreshTrigger }: UsersListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch current user session
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const session = await response.json();
          setCurrentUserId(session.user?.id || null);
        }
      } catch (err) {
        console.error('Failed to fetch current user:', err);
      }
    };
    fetchCurrentUser();
  }, []);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const statusValue = mapMemberStatusToDBStatus(filters.memberStatus);
      const params = new URLSearchParams({
        page: '1',
        limit: '50',
        ...(filters.search && { search: filters.search }),
        ...(statusValue && { status: statusValue }),
        sortBy: mapSortByToField(filters.sortBy),
        sortOrder: filters.dateSort === 'oldest' ? 'asc' : 'desc',
      });

      const response = await fetch(`/api/admin/users?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UsersApiResponse = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, refreshTrigger]);

  const mapSortByToField = (sortBy: string): string => {
    switch (sortBy) {
      case 'alphabetical':
        return 'firstName';
      case 'recent':
        return 'createdAt';
      case 'promotion':
        return 'promotion';
      default:
        return 'firstName';
    }
  };

  const mapMemberStatusToDBStatus = (memberStatus: string): string | null => {
    switch (memberStatus) {
      case 'current':
        return 'CURRENT';
      case 'former':
        return 'FORMER';
      case 'pending':
        return 'PENDING';
      case 'graduated':
        return 'GRADUATED';
      case 'refused':
        return 'REFUSED';
      case 'suspended':
        return 'REFUSED'; // REFUSED is used for suspended users
      case 'deleted':
        return 'DELETED';
      case 'board':
        return null; // Special case: will be handled differently
      default:
        return null;
    }
  };

  // Transform API user data to match UserCard interface
  const transformUser = (user: User) => {
    console.log(`=== TRANSFORM DEBUG for ${user.firstName} ${user.lastName} ===`);

    // Check if user has roles and get the appropriate display name
    let roleDisplay = 'Membre'; // Default for users with no roles
    console.log('Initial roleDisplay:', roleDisplay);

    if (user.roles && user.roles.length > 0) {
      console.log('User has roles:', user.roles.length, 'roles');
      try {
        roleDisplay = getPrimaryRoleName(user.roles, user.pronouns, 'fr');
        console.log('getPrimaryRoleName returned:', roleDisplay);
      } catch (error) {
        console.error('Error getting role display name:', error);
        roleDisplay = 'Membre';
      }
    } else {
      console.log('User has no roles');
    }

    console.log('Final roleDisplay before object creation:', roleDisplay);

    const result = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.photoUrl,
      promotion: user.promotion,
      role: roleDisplay,
      joinDate: new Date(user.createdAt).toISOString().split('T')[0],
      status: user.status.toLowerCase() as
        | 'current'
        | 'former'
        | 'pending'
        | 'graduated'
        | 'refused'
        | 'deleted',
      age: calculateAge(user.birthDate),
      instruments: user.instruments.map((i) => i.name),
      groups: user.groups.map((g) => g.name),
      badges: user.badges,
    };

    console.log('Final result object role field:', result.role);
    console.log('=== END TRANSFORM DEBUG ===');

    return result;
  };

  // Group users by status
  const currentMembers = users.filter((user) => user.status === 'CURRENT').map(transformUser);
  const formerMembers = users
    .filter((user) => user.status === 'FORMER' || user.status === 'GRADUATED')
    .map(transformUser);
  const pendingMembers = users.filter((user) => user.status === 'PENDING').map(transformUser);
  const refusedMembers = users.filter((user) => user.status === 'REFUSED').map(transformUser);
  const deletedMembers = users.filter((user) => user.status === 'DELETED').map(transformUser);
  const boardMembers = users
    .filter((user) => {
      // Board members are those with high weight roles (president, vice-president, etc.)
      return (
        user.roles &&
        user.roles.length > 0 &&
        user.roles.some((role) => role.role?.weight && role.role.weight >= 80)
      );
    })
    .map(transformUser);

  // Determine which sections to show based on filter
  const shouldShowCurrentMembers =
    filters.memberStatus === 'all' || filters.memberStatus === 'current';
  const shouldShowFormerMembers =
    filters.memberStatus === 'all' || filters.memberStatus === 'former';
  const shouldShowPendingMembers =
    filters.memberStatus === 'all' || filters.memberStatus === 'pending';
  const shouldShowRefusedMembers =
    filters.memberStatus === 'all' || filters.memberStatus === 'refused';
  const shouldShowDeletedMembers =
    filters.memberStatus === 'all' || filters.memberStatus === 'deleted';
  const shouldShowBoardMembers = filters.memberStatus === 'board';

  // For board filter, only show board members in a special section
  const displayCurrentMembers = shouldShowBoardMembers ? boardMembers : currentMembers;
  const displayFormerMembers = shouldShowBoardMembers ? [] : formerMembers;
  const displayPendingMembers = shouldShowBoardMembers ? [] : pendingMembers;
  const displayRefusedMembers = shouldShowBoardMembers ? [] : refusedMembers;
  const displayDeletedMembers = shouldShowBoardMembers ? [] : deletedMembers;

  if (loading) {
    return (
      <div className="py-12">
        <Loading text="Loading users..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Error loading users</div>
        <div className="text-gray-500 mb-4">{error}</div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  // Check if any sections will be shown
  const hasAnyResults =
    (shouldShowCurrentMembers && displayCurrentMembers.length > 0) ||
    (shouldShowFormerMembers && displayFormerMembers.length > 0) ||
    (shouldShowPendingMembers && displayPendingMembers.length > 0) ||
    (shouldShowRefusedMembers && displayRefusedMembers.length > 0) ||
    (shouldShowDeletedMembers && displayDeletedMembers.length > 0);

  // Show "no users found" message if no results
  if (!hasAnyResults && users.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
        <p className="text-gray-500 max-w-sm mx-auto mb-6">
          Aucun utilisateur ne correspond aux critères de recherche actuels. Essayez de modifier vos
          filtres ou ajoutez de nouveaux membres.
        </p>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Actualiser
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Members - Show only if filter allows */}
      {shouldShowPendingMembers && displayPendingMembers.length > 0 && (
        <AdminExpandableSection
          title="Pending Approval"
          count={displayPendingMembers.length}
          defaultExpanded={true}
        >
          <div className="space-y-4">
            {displayPendingMembers.map((user) => {
              console.log(
                'Passing to UserCard:',
                user.firstName,
                user.lastName,
                'with role:',
                user.role,
              );
              return <UserCard key={user.id} user={user} currentUserId={currentUserId} />;
            })}
          </div>
        </AdminExpandableSection>
      )}

      {/* Current Members or Board Members */}
      {shouldShowCurrentMembers && (
        <AdminExpandableSection
          title={shouldShowBoardMembers ? 'Board Members' : 'Current Members'}
          count={displayCurrentMembers.length}
          defaultExpanded={true}
        >
          {displayCurrentMembers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No users found in this category.</p>
          ) : (
            <div className="space-y-4">
              {displayCurrentMembers.map((user) => {
                console.log(
                  'Passing to UserCard (current):',
                  user.firstName,
                  user.lastName,
                  'with role:',
                  user.role,
                );
                return <UserCard key={user.id} user={user} currentUserId={currentUserId} />;
              })}
            </div>
          )}
        </AdminExpandableSection>
      )}

      {/* Former Members - Show only if filter allows */}
      {shouldShowFormerMembers && displayFormerMembers.length > 0 && (
        <AdminExpandableSection
          title="Former Members & Graduates"
          count={displayFormerMembers.length}
          defaultExpanded={false}
        >
          <div className="space-y-4">
            {displayFormerMembers.map((user) => (
              <UserCard key={user.id} user={user} currentUserId={currentUserId} />
            ))}
          </div>
        </AdminExpandableSection>
      )}

      {/* Refused/Suspended Members - Show only if filter allows */}
      {shouldShowRefusedMembers && displayRefusedMembers.length > 0 && (
        <AdminExpandableSection
          title="Refused/Suspended Members"
          count={displayRefusedMembers.length}
          defaultExpanded={false}
        >
          <div className="space-y-4">
            {displayRefusedMembers.map((user) => (
              <UserCard key={user.id} user={user} currentUserId={currentUserId} />
            ))}
          </div>
        </AdminExpandableSection>
      )}

      {/* Deleted/Archived Members - Show only if filter allows */}
      {shouldShowDeletedMembers && displayDeletedMembers.length > 0 && (
        <AdminExpandableSection
          title="Deleted/Archived Members"
          count={displayDeletedMembers.length}
          defaultExpanded={false}
        >
          <div className="space-y-4">
            {displayDeletedMembers.map((user) => (
              <UserCard key={user.id} user={user} currentUserId={currentUserId} />
            ))}
          </div>
        </AdminExpandableSection>
      )}

      {/* Pagination Info */}
      {pagination.total > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Showing {users.length} of {pagination.total} users
        </div>
      )}
    </div>
  );
}
