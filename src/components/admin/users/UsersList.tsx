'use client';

import { useState } from 'react';
import AdminExpandableSection from '../common/AdminExpandableSection';
import UserCard from './UserCard';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  promotion: string;
  role: string;
  joinDate: string;
  status: 'current' | 'former' | 'pending' | 'graduated';
}

interface UsersListProps {
  filters: {
    search: string;
    sortBy: string;
    memberStatus: string;
    dateSort: string;
  };
}

// Placeholder data
const MOCK_USERS: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@isep.fr',
    avatar: '/avatars/john.jpg',
    promotion: 'I3',
    role: 'President',
    joinDate: '2024-09-01',
    status: 'current'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@isep.fr',
    avatar: '/avatars/jane.jpg',
    promotion: 'A2',
    role: 'Member',
    joinDate: '2024-09-02',
    status: 'current'
  },
  {
    id: '3',
    firstName: 'Paul',
    lastName: 'Martin',
    email: 'paul@isep.fr',
    promotion: 'I2',
    role: 'Vice-President',
    joinDate: '2024-09-01',
    status: 'current'
  },
  {
    id: '4',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah@isep.fr',
    promotion: 'Graduate',
    role: 'Former Member',
    joinDate: '2023-09-01',
    status: 'graduated'
  },
  {
    id: '5',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike@isep.fr',
    promotion: 'A1',
    role: 'Member',
    joinDate: '2024-12-15',
    status: 'pending'
  }
];

export default function UsersList({ filters }: UsersListProps) {
  // Filter and sort users based on filters
  const filteredUsers = MOCK_USERS.filter(user => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.promotion.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  const currentMembers = filteredUsers.filter(user => user.status === 'current');
  const formerMembers = filteredUsers.filter(user => user.status === 'former' || user.status === 'graduated');
  const pendingMembers = filteredUsers.filter(user => user.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Pending Members - Always show if any */}
      {pendingMembers.length > 0 && (
        <AdminExpandableSection
          title="Pending Approval"
          count={pendingMembers.length}
          defaultExpanded={true}
        >
          {pendingMembers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No users found in this category.</p>
          ) : (
            <div className="space-y-4">
              {pendingMembers.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </AdminExpandableSection>
      )}

      {/* Current Members */}
      <AdminExpandableSection
        title="Current Members"
        count={currentMembers.length}
        defaultExpanded={true}
      >
        {currentMembers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No users found in this category.</p>
        ) : (
          <div className="space-y-4">
            {currentMembers.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </AdminExpandableSection>

      {/* Former Members */}
      <AdminExpandableSection
        title="Former Members & Graduates"
        count={formerMembers.length}
        defaultExpanded={false}
      >
        {formerMembers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No users found in this category.</p>
        ) : (
          <div className="space-y-4">
            {formerMembers.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </AdminExpandableSection>
    </div>
  );
}