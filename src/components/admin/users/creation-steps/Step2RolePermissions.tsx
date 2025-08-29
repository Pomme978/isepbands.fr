'use client';

import { useState, useEffect } from 'react';
import { UserFormData } from '../CreateUserModal';

interface Step2RolePermissionsProps {
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
}

interface Role {
  id: number;
  name: string;
  nameFrMale: string;
  nameFrFemale: string;
  nameEnMale: string;
  nameEnFemale: string;
  weight: number;
  isCore: boolean;
  userCount: number;
  maxUsers: number;
  isAvailable: boolean;
  spotsLeft: number;
}

export default function Step2RolePermissions({ formData, setFormData }: Step2RolePermissionsProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [selectedRoleInfo, setSelectedRoleInfo] = useState<Role | null>(null);

  // Fetch roles from API
  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await fetch('/api/admin/roles');
        if (response.ok) {
          const data = await response.json();
          setRoles(data.roles || []);

          // Set default role to Member if available
          const memberRole = data.roles.find((role: Role) => role.name === 'member');
          if (memberRole && !formData.primaryRole) {
            setFormData({ ...formData, primaryRole: memberRole.nameFrMale });
          }
        } else {
          console.error('Failed to fetch roles');
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setIsLoadingRoles(false);
      }
    }

    fetchRoles();
  }, [formData, setFormData]);

  // Update selected role info when role changes
  useEffect(() => {
    const roleInfo = roles.find(
      (role) =>
        role.nameFrMale === formData.primaryRole ||
        role.nameFrFemale === formData.primaryRole ||
        role.nameEnMale === formData.primaryRole ||
        role.nameEnFemale === formData.primaryRole,
    );
    setSelectedRoleInfo(roleInfo || null);
  }, [formData.primaryRole, roles]);

  const updateRole = (roleDisplayName: string) => {
    setFormData({ ...formData, primaryRole: roleDisplayName });
  };

  const toggleFullAccess = () => {
    setFormData({ ...formData, isFullAccess: !formData.isFullAccess });
  };

  // Filter available roles
  const availableRoles = roles.filter((role) => role.isAvailable);
  const unavailableRoles = roles.filter((role) => !role.isAvailable);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Primary Role</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Association Role *
            </label>
            <select
              value={formData.primaryRole}
              onChange={(e) => updateRole(e.target.value)}
              disabled={isLoadingRoles}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-100"
            >
              {isLoadingRoles ? (
                <option value="">Loading roles...</option>
              ) : (
                <>
                  {availableRoles.map((role) => (
                    <option key={role.id} value={role.nameFrMale}>
                      {role.nameFrMale} {role.spotsLeft < 999 && `(${role.spotsLeft} spots left)`}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="fullAccess"
              checked={formData.isFullAccess}
              onChange={toggleFullAccess}
              className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary/20"
            />
            <div>
              <label htmlFor="fullAccess" className="text-sm font-medium text-gray-700">
                Full Access Override
              </label>
              <p className="text-xs text-gray-500">
                Bypass all permission checks (use with caution - typically for President role only)
              </p>
            </div>
          </div>
        </div>
      </div>

      {formData.isFullAccess && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Full Access Enabled</h4>
              <p className="text-sm text-yellow-700 mt-1">
                This user will have complete access to all administrative functions, bypassing
                role-based permissions. Use with caution.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Selected Role Info */}
      {selectedRoleInfo && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-800">Role Information</h4>
              <p className="text-sm text-blue-700 mt-1">
                {selectedRoleInfo.nameFrMale}: {selectedRoleInfo.userCount}/
                {selectedRoleInfo.maxUsers === 999 ? '∞' : selectedRoleInfo.maxUsers} users
                {selectedRoleInfo.spotsLeft < 999 && selectedRoleInfo.spotsLeft > 0 && (
                  <span className="ml-2 text-green-600">
                    Available ({selectedRoleInfo.spotsLeft} spots left)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Unavailable Roles Warning */}
      {unavailableRoles.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-red-800">Unavailable Roles</h4>
              <p className="text-sm text-red-700 mt-1">
                The following roles are full and cannot be assigned:
              </p>
              <ul className="text-sm text-red-700 mt-2 list-disc list-inside">
                {unavailableRoles.map((role) => (
                  <li key={role.id}>
                    {role.nameFrMale} ({role.userCount}/{role.maxUsers} - Full)
                  </li>
                ))}
              </ul>
              <p className="text-xs text-red-600 mt-2">
                💡 To assign these roles, first remove users from them or change their current
                roles.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Role Guidelines</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>
            • <strong>President:</strong> Full access to all systems including restricted files
          </li>
          <li>
            • <strong>Vice-President:</strong> Complete administrative access except restricted
            files
          </li>
          <li>
            • <strong>Secretary:</strong> Administrative access plus financial document access
          </li>
          <li>
            • <strong>Treasurer:</strong> Financial focus with selective administrative permissions
          </li>
          <li>
            • <strong>Communications:</strong> Communication tools and content management
          </li>
          <li>
            • <strong>Member:</strong> Basic member permissions only
          </li>
        </ul>
      </div>
    </div>
  );
}
