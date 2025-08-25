'use client';

import { useState } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  // Add other properties as needed
}

interface UserEditPermissionsProps {
  user: User;
  setUser: (user: User) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}

const AVAILABLE_ROLES = [
  { value: 'Member', label: 'Member', description: 'Basic member permissions' },
  { value: 'President', label: 'President', description: 'Full access to all systems' },
  { value: 'Vice-President', label: 'Vice-President', description: 'Administrative access' },
  { value: 'Secretary', label: 'Secretary', description: 'Administrative access + documents' },
  { value: 'Treasurer', label: 'Treasurer', description: 'Financial permissions' },
  { value: 'Communications', label: 'Communications', description: 'Communication tools' },
  { value: 'Former-Member', label: 'Former Member', description: 'Limited access' }
];

const AVAILABLE_PERMISSIONS = [
  { id: 'admin_dashboard', label: 'Admin Dashboard Access', description: 'Access to admin panel' },
  { id: 'user_management', label: 'User Management', description: 'Manage user accounts' },
  { id: 'band_management', label: 'Band Management', description: 'Manage bands and groups' },
  { id: 'event_creation', label: 'Event Creation', description: 'Create new events' },
  { id: 'event_management', label: 'Event Management', description: 'Manage existing events' },
  { id: 'newsletter_access', label: 'Newsletter Access', description: 'Send newsletters and communications' },
  { id: 'content_management', label: 'Content Management', description: 'Edit site content' },
  { id: 'media_library', label: 'Media Library Access', description: 'Manage site media' },
  { id: 'files_access', label: 'Files Access (Restricted)', description: 'Access restricted files' }
];

export default function UserEditPermissions({ user, setUser, setHasUnsavedChanges }: UserEditPermissionsProps) {
  const [fullAccessOverride, setFullAccessOverride] = useState(user.role === 'President');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'admin_dashboard',
    'user_management'
  ]); // Mock selected permissions

  const updateRole = (newRole: string) => {
    setUser({ ...user, role: newRole });
    setHasUnsavedChanges(true);
    
    // Auto-enable full access for President
    if (newRole === 'President') {
      setFullAccessOverride(true);
    }
  };

  const toggleFullAccess = () => {
    const newValue = !fullAccessOverride;
    setFullAccessOverride(newValue);
    setHasUnsavedChanges(true);
  };

  const togglePermission = (permissionId: string) => {
    const newPermissions = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter(p => p !== permissionId)
      : [...selectedPermissions, permissionId];
    
    setSelectedPermissions(newPermissions);
    setHasUnsavedChanges(true);
  };

  const getRoleRecommendedPermissions = (role: string) => {
    switch (role) {
      case 'President':
        return AVAILABLE_PERMISSIONS.map(p => p.id);
      case 'Vice-President':
        return ['admin_dashboard', 'user_management', 'band_management', 'event_management', 'content_management'];
      case 'Secretary':
        return ['admin_dashboard', 'user_management', 'event_management', 'files_access'];
      case 'Treasurer':
        return ['admin_dashboard', 'event_management', 'files_access'];
      case 'Communications':
        return ['admin_dashboard', 'newsletter_access', 'content_management', 'media_library'];
      default:
        return [];
    }
  };

  const applyRecommendedPermissions = () => {
    const recommended = getRoleRecommendedPermissions(user.role);
    setSelectedPermissions(recommended);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-8">
      {/* Role Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Association Role</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {AVAILABLE_ROLES.map((role) => (
            <div
              key={role.value}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                user.role === role.value
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => updateRole(role.value)}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  checked={user.role === role.value}
                  onChange={() => updateRole(role.value)}
                  className="text-primary border-gray-300 focus:ring-primary/20"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{role.label}</h4>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Access Override */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="fullAccess"
            checked={fullAccessOverride}
            onChange={toggleFullAccess}
            className="mt-1 h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary/20"
          />
          <div>
            <label htmlFor="fullAccess" className="text-lg font-semibold text-gray-900">
              Full Access Override
            </label>
            <p className="text-sm text-gray-600 mt-1">
              Bypass all permission checks. This user will have access to all features regardless 
              of individual permissions. Use with extreme caution - typically reserved for the President role only.
            </p>
            {fullAccessOverride && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium">
                  ⚠️ Full Access is enabled. This user can access all admin functions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Individual Permissions */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Individual Permissions</h3>
          <button
            onClick={applyRecommendedPermissions}
            disabled={fullAccessOverride}
            className={`text-sm font-medium transition-colors ${
              fullAccessOverride 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-primary hover:text-primary/80'
            }`}
          >
            Apply Recommended for {user.role}
          </button>
        </div>

        {fullAccessOverride && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">
              Individual permissions are ignored when Full Access Override is enabled.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {AVAILABLE_PERMISSIONS.map((permission) => (
            <div
              key={permission.id}
              className={`flex items-start space-x-3 p-4 border rounded-lg transition-colors ${
                fullAccessOverride
                  ? 'bg-gray-50 border-gray-200'
                  : selectedPermissions.includes(permission.id)
                  ? 'bg-primary/5 border-primary/30'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                id={permission.id}
                checked={selectedPermissions.includes(permission.id)}
                onChange={() => togglePermission(permission.id)}
                disabled={fullAccessOverride}
                className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary/20 disabled:opacity-50"
              />
              <div className="flex-1">
                <label
                  htmlFor={permission.id}
                  className={`font-medium cursor-pointer ${
                    fullAccessOverride ? 'text-gray-400' : 'text-gray-900'
                  }`}
                >
                  {permission.label}
                </label>
                <p className={`text-sm ${
                  fullAccessOverride ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {permission.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permission Summary */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission Summary</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Current Role:</span>
              <span className="ml-2 text-gray-900">{user.role}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Access Level:</span>
              <span className="ml-2 text-gray-900">
                {fullAccessOverride ? 'Full Access (All permissions)' : `${selectedPermissions.length} specific permissions`}
              </span>
            </div>
          </div>
          
          {!fullAccessOverride && selectedPermissions.length > 0 && (
            <div className="mt-3">
              <span className="font-medium text-gray-700">Active Permissions:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {selectedPermissions.map(permissionId => {
                  const permission = AVAILABLE_PERMISSIONS.find(p => p.id === permissionId);
                  return (
                    <span
                      key={permissionId}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      {permission?.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}