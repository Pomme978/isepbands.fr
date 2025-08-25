'use client';

import { useState } from 'react';
import { Calendar, User, Music, Users, Settings, FileText, Search } from 'lucide-react';

interface UserEditActivityLogProps {
  userId: string;
}

interface ActivityLogEntry {
  id: string;
  timestamp: string;
  action: string;
  category: 'user' | 'group' | 'event' | 'system' | 'admin';
  description: string;
  details?: string;
  performedBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

// Mock activity data
const MOCK_ACTIVITY: ActivityLogEntry[] = [
  {
    id: '1',
    timestamp: '2024-12-20T10:30:00Z',
    action: 'LOGIN',
    category: 'user',
    description: 'User logged in',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '2',
    timestamp: '2024-12-20T09:15:00Z',
    action: 'PROFILE_UPDATE',
    category: 'user',
    description: 'Updated profile bio',
    details: 'Changed biography text',
    performedBy: 'Self'
  },
  {
    id: '3',
    timestamp: '2024-12-19T18:45:00Z',
    action: 'EVENT_REGISTER',
    category: 'event',
    description: 'Registered for "Winter Concert 2024"',
    details: 'Role: Performer with The Rockers'
  },
  {
    id: '4',
    timestamp: '2024-12-19T14:20:00Z',
    action: 'GROUP_JOIN',
    category: 'group',
    description: 'Joined group "Jazz Collective"',
    details: 'Role: Rhythm Guitarist',
    performedBy: 'Auto (group invitation accepted)'
  },
  {
    id: '5',
    timestamp: '2024-12-18T16:30:00Z',
    action: 'PASSWORD_RESET',
    category: 'system',
    description: 'Password was reset',
    performedBy: 'Maxime Dupont (Admin)',
    details: 'Admin-initiated password reset'
  },
  {
    id: '6',
    timestamp: '2024-12-17T11:00:00Z',
    action: 'PERMISSION_CHANGE',
    category: 'admin',
    description: 'User permissions updated',
    performedBy: 'Maxime Dupont (Admin)',
    details: 'Added: Event Management permission'
  },
  {
    id: '7',
    timestamp: '2024-12-16T20:15:00Z',
    action: 'LOGOUT',
    category: 'user',
    description: 'User logged out',
    ipAddress: '192.168.1.100'
  },
  {
    id: '8',
    timestamp: '2024-12-15T19:30:00Z',
    action: 'EVENT_ATTEND',
    category: 'event',
    description: 'Attended "Winter Concert 2024"',
    details: 'Performance completed successfully'
  },
  {
    id: '9',
    timestamp: '2024-12-15T18:00:00Z',
    action: 'LOGIN',
    category: 'user',
    description: 'User logged in',
    ipAddress: '10.0.0.50',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
  },
  {
    id: '10',
    timestamp: '2024-12-14T15:45:00Z',
    action: 'INSTRUMENT_UPDATE',
    category: 'user',
    description: 'Updated instrument skills',
    details: 'Added Piano/Keyboard (Intermediate level)',
    performedBy: 'Self'
  }
];

export default function UserEditActivityLog({ userId }: UserEditActivityLogProps) {
  const [activities, setActivities] = useState<ActivityLogEntry[]>(MOCK_ACTIVITY);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('30'); // days

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'group':
        return <Users className="w-4 h-4" />;
      case 'event':
        return <Calendar className="w-4 h-4" />;
      case 'system':
        return <Settings className="w-4 h-4" />;
      case 'admin':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'user':
        return 'bg-blue-100 text-blue-800';
      case 'group':
        return 'bg-green-100 text-green-800';
      case 'event':
        return 'bg-purple-100 text-purple-800';
      case 'system':
        return 'bg-orange-100 text-orange-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionSeverity = (action: string) => {
    const highSeverity = ['PASSWORD_RESET', 'PERMISSION_CHANGE', 'ACCOUNT_DISABLE'];
    const mediumSeverity = ['GROUP_JOIN', 'GROUP_LEAVE', 'ROLE_CHANGE'];
    
    if (highSeverity.includes(action)) return 'high';
    if (mediumSeverity.includes(action)) return 'medium';
    return 'low';
  };

  const filteredActivities = activities.filter(activity => {
    // Category filter
    if (filter !== 'all' && activity.category !== filter) return false;
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        activity.action.toLowerCase().includes(searchLower) ||
        activity.description.toLowerCase().includes(searchLower) ||
        activity.details?.toLowerCase().includes(searchLower) ||
        activity.performedBy?.toLowerCase().includes(searchLower)
      );
    }
    
    // Date filter
    const activityDate = new Date(activity.timestamp);
    const filterDate = new Date();
    filterDate.setDate(filterDate.getDate() - parseInt(dateFilter));
    
    return activityDate >= filterDate;
  });

  const ActivityEntry = ({ activity }: { activity: ActivityLogEntry }) => {
    const severity = getActionSeverity(activity.action);
    
    return (
      <div className={`p-4 border-l-4 rounded-lg bg-white border-gray-200 ${
        severity === 'high' ? 'border-l-red-500 bg-red-50' :
        severity === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
        'border-l-gray-300'
      }`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(activity.category)}`}>
              {getCategoryIcon(activity.category)}
              <span className="ml-1 capitalize">{activity.category}</span>
            </span>
            <span className="font-mono text-sm font-medium text-gray-900">
              {activity.action}
            </span>
          </div>
          <time className="text-sm text-gray-500">
            {new Date(activity.timestamp).toLocaleString('en-US', {
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </time>
        </div>

        <p className="text-gray-900 mb-2">{activity.description}</p>

        {activity.details && (
          <div className="mb-2 p-2 bg-gray-100 rounded text-sm text-gray-700">
            <strong>Details:</strong> {activity.details}
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          {activity.performedBy && (
            <span>
              <strong>Performed by:</strong> {activity.performedBy}
            </span>
          )}
          {activity.ipAddress && (
            <span>
              <strong>IP:</strong> {activity.ipAddress}
            </span>
          )}
          {activity.userAgent && (
            <span className="truncate max-w-xs">
              <strong>Device:</strong> {activity.userAgent.split('(')[1]?.split(')')[0] || 'Unknown'}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search activities..."
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="all">All Categories</option>
              <option value="user">User Actions</option>
              <option value="group">Group Activities</option>
              <option value="event">Event Activities</option>
              <option value="system">System Actions</option>
              <option value="admin">Admin Actions</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Period
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
              <option value="999999">All time</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilter('all');
                setSearchTerm('');
                setDateFilter('30');
              }}
              className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Activity Statistics */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Activity Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['user', 'group', 'event', 'system', 'admin'].map(category => (
            <div key={category} className="text-center">
              <div className="text-lg font-bold text-primary">
                {activities.filter(a => a.category === category).length}
              </div>
              <div className="text-sm text-gray-600 capitalize">{category} Actions</div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Log */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Activity Log ({filteredActivities.length} entries)
          </h3>
          <button className="text-sm text-primary hover:text-primary/80 font-medium">
            Export Log
          </button>
        </div>

        {filteredActivities.length > 0 ? (
          <div className="space-y-3">
            {filteredActivities.map(activity => (
              <ActivityEntry key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No activities found</p>
            <p className="text-sm">Try adjusting the filters above</p>
          </div>
        )}
      </div>

      {/* Activity Log Information */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Activity Log Information</h3>
        <div className="bg-blue-50 p-4 rounded-lg">
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>User actions</strong> are automatically logged when the user performs them</li>
            <li>• <strong>Admin actions</strong> show who performed administrative changes</li>
            <li>• <strong>System actions</strong> are automated processes and security events</li>
            <li>• <strong>IP addresses</strong> and device information help track security</li>
            <li>• <strong>High-severity actions</strong> (red border) require special attention</li>
            <li>• Activity logs are retained for 2 years for security and auditing purposes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}