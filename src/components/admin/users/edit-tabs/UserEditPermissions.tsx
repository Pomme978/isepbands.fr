'use client';

import { useState, useEffect } from 'react';
import { getRoleDisplayName } from '@/utils/roleUtils';
import Loading from '@/components/ui/Loading';

interface Role {
  id: number;
  name: string;
  nameFrMale: string;
  nameFrFemale: string;
  nameEnMale: string;
  nameEnFemale: string;
  weight: number;
  isCore: boolean;
  permissions?: {
    permission: {
      id: number;
      name: string;
      nameFr: string;
      nameEn: string;
      description: string;
    };
  }[];
}

interface Permission {
  id: number;
  name: string;
  nameFr: string;
  nameEn: string;
  description?: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  roles?: {
    role: Role;
  }[];
  isFullAccess?: boolean;
  // Add other properties as needed
}

interface UserEditPermissionsProps {
  user: User;
  setUser: (user: User) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}


export default function UserEditPermissions({ user, setUser, setHasUnsavedChanges }: UserEditPermissionsProps) {
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>(user.roles?.map(r => r.role?.id || r.roleId || r.id) || []);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [isFullAccess, setIsFullAccess] = useState(user.isFullAccess || false);

  // Get current permissions from user roles
  const getCurrentPermissions = (roles: typeof availableRoles, userRoles: User['roles']) => {
    if (!userRoles || userRoles.length === 0) return new Set<number>();
    
    const permissionIds = new Set<number>();
    
    userRoles.forEach(userRole => {
      const roleId = userRole.role?.id || userRole.roleId || userRole.id;
      const fullRole = roles.find(r => r.id === roleId);
      if (fullRole && fullRole.permissions) {
        fullRole.permissions.forEach(p => {
          permissionIds.add(p.permission.id);
        });
      }
    });
    
    return permissionIds;
  };

  // Fetch available roles and permissions
  useEffect(() => {
    const fetchRolesAndPermissions = async () => {
      try {
        const [rolesResponse, permissionsResponse] = await Promise.all([
          fetch('/api/admin/roles'),
          fetch('/api/admin/permissions')
        ]);

        if (rolesResponse.ok && permissionsResponse.ok) {
          const rolesData = await rolesResponse.json();
          const permissionsData = await permissionsResponse.json();
          const roles = rolesData.roles || [];
          
          setAvailableRoles(roles);
          setAvailablePermissions(permissionsData.permissions || []);
          
          // Initialize current permissions from user roles
          const currentPermissions = getCurrentPermissions(roles, user.roles);
          setSelectedPermissions(Array.from(currentPermissions));
        }
      } catch (error) {
        console.error('Error fetching roles and permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRolesAndPermissions();
  }, [user.roles]);

  if (loading) {
    return (
      <div className="py-8">
        <Loading text="Loading permissions..." size="md" />
      </div>
    );
  }

  const updateRoles = (roleId: number) => {
    const newSelectedRoles = selectedRoleIds.includes(roleId)
      ? selectedRoleIds.filter(id => id !== roleId)
      : [...selectedRoleIds, roleId];
    
    setSelectedRoleIds(newSelectedRoles);
    
    // Update the user object with new roles - keep original structure that matches API expectation
    const newRoles = newSelectedRoles.map(id => {
      const role = availableRoles.find(r => r.id === id);
      return role ? { 
        role: role  // Simplified structure that matches API expectation
      } : null;
    }).filter(Boolean);
    
    setUser({ ...user, roles: newRoles });
    setHasUnsavedChanges(true);
  };

  const toggleFullAccess = () => {
    const newFullAccess = !isFullAccess;
    setIsFullAccess(newFullAccess);
    setUser({ ...user, isFullAccess: newFullAccess });
    setHasUnsavedChanges(true);
  };

  // Full Access is now handled by togglePermission(6)

  const togglePermission = (permissionId: number) => {
    const newPermissions = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter(p => p !== permissionId)
      : [...selectedPermissions, permissionId];
    
    setSelectedPermissions(newPermissions);
    setHasUnsavedChanges(true);
  };

  const applyRolePermissions = () => {
    // Get all permissions from selected roles
    const rolePermissions = new Set<number>();
    selectedRoleIds.forEach(roleId => {
      const role = availableRoles.find(r => r.id === roleId);
      // Note: we'd need to fetch role permissions from API
      // For now just clear individual permissions when applying role permissions
    });
    
    setSelectedPermissions([]);
    setHasUnsavedChanges(true);
  };

  const getCurrentRoleNames = () => {
    return selectedRoleIds.map(roleId => {
      const role = availableRoles.find(r => r.id === roleId);
      return role ? getRoleDisplayName(role, user.pronouns, 'fr') : 'Unknown';
    }).join(', ') || 'None';
  };

  const getPermissionSource = (permissionId: number) => {
    // Check if this permission comes from any of the user's roles
    const fromRoles = selectedRoleIds.some(roleId => {
      const role = availableRoles.find(r => r.id === roleId);
      return role?.permissions?.some(p => p.permission.id === permissionId);
    });
    
    return fromRoles ? 'role' : 'individual';
  };

  return (
    <div className="space-y-8">
      {/* Role Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Association Role</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableRoles.map((role) => (
            <div
              key={role.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedRoleIds.includes(role.id)
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => updateRoles(role.id)}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedRoleIds.includes(role.id)}
                  onChange={() => updateRoles(role.id)}
                  className="text-primary border-gray-300 focus:ring-primary/20"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{getRoleDisplayName(role, user.pronouns, 'fr')}</h4>
                  <p className="text-sm text-gray-600">
                    Weight: {role.weight} • {role.isCore ? 'Core Role' : 'Custom Role'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Access Override */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Override</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
            <input
              type="checkbox"
              id="fullAccess"
              checked={isFullAccess}
              onChange={toggleFullAccess}
              className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary/20"
            />
            <div className="flex-1">
              <label htmlFor="fullAccess" className="text-sm font-medium text-gray-700">
                Full Access Override
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Grant complete administrative access, bypassing role-based permissions. Use with caution.
              </p>
            </div>
          </div>

          {isFullAccess && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Full Access Enabled</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    This user has complete access to all administrative functions, regardless of their role assignments.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role Summary */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Summary</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm space-y-2">
            <div>
              <span className="font-medium text-gray-700">Current Roles:</span>
              <span className="ml-2 text-gray-900">{getCurrentRoleNames()}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Access Level:</span>
              <span className={`ml-2 font-medium ${isFullAccess ? 'text-yellow-600' : 'text-gray-900'}`}>
                {isFullAccess ? 'Full Access (Override Active)' : 'Role-based permissions'}
              </span>
            </div>
            {isFullAccess && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-yellow-600">
                  ⚠️ Full Access Override bypasses all role-based permission restrictions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}