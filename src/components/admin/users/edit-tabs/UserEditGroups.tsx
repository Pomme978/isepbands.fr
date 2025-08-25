'use client';

import { useState } from 'react';
import { ExternalLink, Calendar, Users, Crown, UserPlus } from 'lucide-react';
import LangLink from '@/components/common/LangLink';

interface UserEditGroupsProps {
  userId: string;
}

interface GroupMembership {
  id: string;
  groupName: string;
  groupId: string;
  roles: string[];
  instruments: string[];
  joinDate: string;
  leaveDate?: string;
  status: 'active' | 'inactive' | 'left';
  isAdmin: boolean;
  memberCount: number;
}

// Mock data
const MOCK_GROUPS: GroupMembership[] = [
  {
    id: '1',
    groupName: 'The Rockers',
    groupId: 'group-1',
    roles: ['Lead Guitarist', 'Backing Vocals'],
    instruments: ['Guitar', 'Vocals'],
    joinDate: '2024-09-01',
    status: 'active',
    isAdmin: true,
    memberCount: 4
  },
  {
    id: '2',
    groupName: 'Jazz Collective',
    groupId: 'group-2',
    roles: ['Rhythm Guitarist'],
    instruments: ['Guitar'],
    joinDate: '2024-10-15',
    status: 'active',
    isAdmin: false,
    memberCount: 6
  },
  {
    id: '3',
    groupName: 'Classic Covers',
    groupId: 'group-3',
    roles: ['Lead Guitarist'],
    instruments: ['Guitar'],
    joinDate: '2024-08-01',
    leaveDate: '2024-11-30',
    status: 'left',
    isAdmin: false,
    memberCount: 5
  }
];

const AVAILABLE_GROUPS = [
  { id: 'group-4', name: 'Electric Dreams', memberCount: 3, seekingInstruments: ['Bass', 'Drums'] },
  { id: 'group-5', name: 'Acoustic Sessions', memberCount: 2, seekingInstruments: ['Vocals', 'Guitar'] },
  { id: 'group-6', name: 'Metal Force', memberCount: 4, seekingInstruments: ['Vocals'] }
];

export default function UserEditGroups({ userId }: UserEditGroupsProps) {
  const [groups, setGroups] = useState<GroupMembership[]>(MOCK_GROUPS);
  const [showAddGroup, setShowAddGroup] = useState(false);

  const activeGroups = groups.filter(g => g.status === 'active');
  const inactiveGroups = groups.filter(g => g.status !== 'active');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'left':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const GroupCard = ({ group }: { group: GroupMembership }) => (
    <div className={`p-4 border-2 rounded-lg transition-colors ${
      group.status === 'active' 
        ? 'border-green-200 bg-green-50' 
        : 'border-gray-200 bg-gray-50'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <h4 className="font-semibold text-gray-900">{group.groupName}</h4>
          {group.isAdmin && (
            <Crown className="w-4 h-4 text-yellow-500" title="Group Administrator" />
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(group.status)}`}>
            {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
          </span>
          <LangLink
            href={`/admin/bands/${group.groupId}`}
            className="text-primary hover:text-primary/80 transition-colors"
            title="View group admin page"
          >
            <ExternalLink className="w-4 h-4" />
          </LangLink>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Roles:</span>
          <span className="font-medium text-gray-900">{group.roles.join(', ')}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Instruments:</span>
          <span className="font-medium text-gray-900">{group.instruments.join(', ')}</span>
        </div>

        <div className="flex justify-between">
          <span>Members:</span>
          <span className="font-medium text-gray-900 flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {group.memberCount}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Joined:</span>
          <span className="font-medium text-gray-900">
            {new Date(group.joinDate).toLocaleDateString()}
          </span>
        </div>

        {group.leaveDate && (
          <div className="flex justify-between">
            <span>Left:</span>
            <span className="font-medium text-gray-900">
              {new Date(group.leaveDate).toLocaleDateString()}
            </span>
          </div>
        )}

      </div>

      {group.status === 'active' && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <button className="text-sm text-red-600 hover:text-red-800 font-medium">
              Remove from Group
            </button>
            <div className="flex space-x-2">
              {!group.isAdmin && (
                <button className="text-sm text-primary hover:text-primary/80 font-medium">
                  Make Admin
                </button>
              )}
              {group.isAdmin && (
                <button className="text-sm text-orange-600 hover:text-orange-800 font-medium">
                  Remove Admin
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Current Active Groups */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Current Groups ({activeGroups.length}/2)
        </h3>
        
        {activeGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {activeGroups.map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">Not in any active groups</p>
            <p className="text-sm">User can join up to 2 active groups</p>
          </div>
        )}

        {activeGroups.length < 2 && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowAddGroup(true)}
              className="inline-flex items-center px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add to Group
            </button>
          </div>
        )}
      </div>

      {/* Add to Group Modal */}
      {showAddGroup && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-blue-900">Add User to Group</h4>
            <button
              onClick={() => setShowAddGroup(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-blue-700">
              Select a group to add this user to. Available groups that are currently seeking members:
            </p>
            
            <div className="space-y-2">
              {AVAILABLE_GROUPS.map(group => (
                <div key={group.id} className="flex items-center justify-between bg-white p-3 rounded border">
                  <div>
                    <span className="font-medium text-gray-900">{group.name}</span>
                    <p className="text-sm text-gray-600">
                      {group.memberCount} members • Seeking: {group.seekingInstruments.join(', ')}
                    </p>
                  </div>
                  <button className="text-sm bg-primary text-white px-3 py-1 rounded hover:bg-primary/90 transition-colors">
                    Add User
                  </button>
                </div>
              ))}
            </div>
            
            <div className="text-center pt-2 border-t border-blue-200">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View All Groups
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Past/Inactive Groups */}
      {inactiveGroups.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Past Groups ({inactiveGroups.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inactiveGroups.map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>
      )}

      {/* Group History Stats */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-primary">{groups.length}</div>
            <div className="text-sm text-gray-600">Total Groups Joined</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{activeGroups.length}</div>
            <div className="text-sm text-gray-600">Currently Active</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {groups.filter(g => g.isAdmin).length}
            </div>
            <div className="text-sm text-gray-600">Administrator Roles</div>
          </div>
        </div>
      </div>

      {/* Group Management Guidelines */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Group Management Guidelines</h3>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Members can join up to 2 active groups at a time</li>
            <li>• Removing a user from a group will notify the group administrators</li>
            <li>• Group admin status should be granted carefully - admins can manage the entire group</li>
            <li>• Past group history is preserved for reference and statistics</li>
            <li>• Always check with the user before making significant changes to their group memberships</li>
          </ul>
        </div>
      </div>
    </div>
  );
}