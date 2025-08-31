'use client';

import { useState, useEffect } from 'react';
import { getRoleDisplayName } from '@/utils/roleUtils';
import { getRoleClasses } from '@/utils/roleColors';
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
  userCount?: number;
  maxUsers?: number;
  isAvailable?: boolean;
  spotsLeft?: number;
  permissions?: Permission[];
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
  pronouns?: string;
  // Add other properties as needed
}

interface UserEditPermissionsProps {
  user: User;
  setUser: (user: User) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}

export default function UserEditPermissions({
  user,
  setUser,
  setHasUnsavedChanges,
}: UserEditPermissionsProps) {
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>(
    user.roles?.map((r) => r.role?.id) || [],
  );
  const [originalRoleIds] = useState<number[]>(user.roles?.map((r) => r.role?.id) || []);
  const [isFullAccess, setIsFullAccess] = useState(user.isFullAccess || false);

  // Get current permissions from user roles

  // Fetch available roles and permissions
  useEffect(() => {
    const fetchRolesAndPermissions = async () => {
      try {
        const [rolesResponse] = await Promise.all([fetch('/api/admin/roles')]);

        if (rolesResponse.ok) {
          const rolesData = await rolesResponse.json();
          const roles = rolesData.roles || [];

          setAvailableRoles(roles);
          // Roles data loaded, permissions will be initialized in separate useEffect
        }
      } catch (error) {
        console.log('Error fetching roles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRolesAndPermissions();
  }, []); // Only fetch once on mount

  // Initialize permissions from user roles when roles are loaded
  useEffect(() => {
    // Permissions logic removed, nothing to do here
  }, [availableRoles, user.roles]);

  if (loading) {
    return (
      <div className="py-8">
        <Loading text="Loading permissions..." size="md" />
      </div>
    );
  }

  // Calculate adjusted role availability considering current user's changes
  const getAdjustedRoleAvailability = (role: Role) => {
    const originallyHadThisRole = originalRoleIds.includes(role.id);
    const currentlySelectedThisRole = selectedRoleIds.includes(role.id);

    let adjustedUserCount = role.userCount || 0;
    let adjustedIsAvailable = role.isAvailable || false;
    let adjustedSpotsLeft = role.spotsLeft || 0;

    // If user originally had this role but no longer does, decrease count
    if (originallyHadThisRole && !currentlySelectedThisRole) {
      adjustedUserCount = Math.max(0, adjustedUserCount - 1);
      adjustedSpotsLeft = (role.maxUsers || 1) - adjustedUserCount;
      adjustedIsAvailable = adjustedSpotsLeft > 0;
    }
    // If user didn't have this role but now does, increase count
    else if (!originallyHadThisRole && currentlySelectedThisRole) {
      adjustedUserCount = adjustedUserCount + 1;
      adjustedSpotsLeft = Math.max(0, (role.maxUsers || 1) - adjustedUserCount);
      adjustedIsAvailable = adjustedSpotsLeft > 0 || currentlySelectedThisRole;
    }

    return {
      userCount: adjustedUserCount,
      maxUsers: role.maxUsers,
      isAvailable: adjustedIsAvailable,
      spotsLeft: adjustedSpotsLeft,
    };
  };

  const updateRoles = (roleId: number) => {
    const role = availableRoles.find((r) => r.id === roleId);
    const isCurrentlySelected = selectedRoleIds.includes(roleId);
    const adjustedAvailability = getAdjustedRoleAvailability(role!);

    // Check if role is not available and not currently selected
    if (role && !adjustedAvailability.isAvailable && !isCurrentlySelected) {
      return; // Don't allow selection of unavailable roles
    }

    // Restrict to only one role at a time
    const newSelectedRoles = isCurrentlySelected
      ? [] // Remove if already selected
      : [roleId]; // Replace with only the new one

    setSelectedRoleIds(newSelectedRoles);

    // Update the user object with new roles - keep original structure that matches API expectation
    const newRoles = newSelectedRoles
      .map((id) => {
        const role = availableRoles.find((r) => r.id === id);
        return role ? { role } : null;
      })
      .filter((r): r is { role: Role } => !!r);

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

  return (
    <div className="space-y-8">
      {/* Role Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Association Role</h3>
        <p className="text-sm text-gray-600 mb-4">
          Un seul rôle peut être assigné par utilisateur.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableRoles.map((role) => {
            const isSelected = selectedRoleIds.includes(role.id);
            const adjustedAvailability = getAdjustedRoleAvailability(role);
            const isNotAvailable = !adjustedAvailability.isAvailable && !isSelected;
            const isDisabled = isNotAvailable;

            return (
              <div
                key={role.id}
                className={`p-4 border-2 rounded-lg transition-all ${
                  isDisabled
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                    : isSelected
                      ? 'border-primary bg-primary/5 cursor-pointer'
                      : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                }`}
                onClick={() => !isDisabled && updateRoles(role.id)}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="userRole"
                    checked={isSelected}
                    onChange={() => !isDisabled && updateRoles(role.id)}
                    disabled={isDisabled}
                    className="text-primary border-gray-300 focus:ring-primary/20 disabled:opacity-50"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h4
                          className={`font-medium ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}
                        >
                          {getRoleDisplayName(role, user.pronouns, 'fr')}
                        </h4>
                        {!isDisabled && (
                          <span
                            className={getRoleClasses(
                              getRoleDisplayName(role, user.pronouns, 'fr'),
                            )}
                          >
                            {getRoleDisplayName(role, user.pronouns, 'fr')}
                          </span>
                        )}
                      </div>
                      {/* Always show counter for non-unlimited roles */}
                      {role.maxUsers !== undefined && role.maxUsers < 999 && (
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            isNotAvailable && !isSelected
                              ? 'bg-red-100 text-red-700'
                              : isSelected || adjustedAvailability.spotsLeft > 0
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {isSelected
                            ? `Sélectionné (${adjustedAvailability.userCount}/${role.maxUsers})`
                            : isNotAvailable
                              ? `Complet (${adjustedAvailability.userCount}/${role.maxUsers})`
                              : `${adjustedAvailability.spotsLeft} place${adjustedAvailability.spotsLeft > 1 ? 's' : ''} restante${adjustedAvailability.spotsLeft > 1 ? 's' : ''}`}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
                      Weight: {role.weight} • {role.isCore ? 'Core Role' : 'Custom Role'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
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
                Grant complete administrative access, bypassing role-based permissions. Use with
                caution.
              </p>
            </div>
          </div>

          {isFullAccess && (
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
                    This user has complete access to all administrative functions, regardless of
                    their role assignments.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
