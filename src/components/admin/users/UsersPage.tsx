'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import AdminPageHeader from '../common/AdminPageHeader';
import AdminFilters, { FilterConfig } from '../common/AdminFilters';
import UsersList from './UsersList';
import CreateUserModal from './CreateUserModal';

export default function UsersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filterValues, setFilterValues] = useState({
    search: '',
    sortBy: 'alphabetical',
    memberStatus: 'all',
    dateSort: 'newest',
  });

  const filterConfig: FilterConfig[] = [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search users by name, email, or promotion...',
      value: filterValues.search,
    },
    {
      key: 'sortBy',
      label: 'Sort By',
      type: 'select',
      value: filterValues.sortBy,
      options: [
        { value: 'alphabetical', label: 'Alphabetical' },
        { value: 'recent', label: 'Most Recent' },
        { value: 'role', label: 'By Role' },
        { value: 'promotion', label: 'By Promotion' },
      ],
    },
    {
      key: 'memberStatus',
      label: 'Member Status',
      type: 'select',
      value: filterValues.memberStatus,
      options: [
        { value: 'all', label: 'All Members' },
        { value: 'current', label: 'Current Members' },
        { value: 'former', label: 'Former Members' },
        { value: 'pending', label: 'Pending Approval' },
        { value: 'refused', label: 'Refused/Suspended' },
        { value: 'deleted', label: 'Deleted/Archived' },
        { value: 'board', label: 'Board Members' },
      ],
    },
    {
      key: 'dateSort',
      label: 'Date Sort',
      type: 'select',
      value: filterValues.dateSort,
      options: [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
      ],
    },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleUserCreated = () => {
    // Trigger refresh by incrementing the counter
    setRefreshTrigger((prev) => prev + 1);
    // Close modal
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Users Management"
        description="Manage all association members and their permissions"
        actions={
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New User
          </button>
        }
      />

      {/* Filters */}
      <AdminFilters filters={filterConfig} onFilterChange={handleFilterChange} />

      {/* Users List */}
      <UsersList filters={filterValues} refreshTrigger={refreshTrigger} />

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
}
