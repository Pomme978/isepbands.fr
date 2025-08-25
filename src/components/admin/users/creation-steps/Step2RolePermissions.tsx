'use client';

import { UserFormData } from '../CreateUserModal';

interface Step2RolePermissionsProps {
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
}

const AVAILABLE_PERMISSIONS = [
  { id: 'admin_dashboard', label: 'Admin Dashboard Access' },
  { id: 'user_management', label: 'User Management' },
  { id: 'band_management', label: 'Band Management' },
  { id: 'event_creation', label: 'Event Creation' },
  { id: 'event_management', label: 'Event Management' },
  { id: 'newsletter_access', label: 'Newsletter Access' },
  { id: 'content_management', label: 'Content Management' },
  { id: 'media_library', label: 'Media Library Access' },
  { id: 'files_access', label: 'Files Access (Restricted)' }
];

export default function Step2RolePermissions({ formData, setFormData }: Step2RolePermissionsProps) {
  const updateRole = (role: string) => {
    setFormData({ ...formData, primaryRole: role });
  };

  const toggleFullAccess = () => {
    setFormData({ ...formData, fullAccessOverride: !formData.fullAccessOverride });
  };

  const togglePermission = (permissionId: string) => {
    const currentPermissions = formData.permissions || [];
    const newPermissions = currentPermissions.includes(permissionId)
      ? currentPermissions.filter(p => p !== permissionId)
      : [...currentPermissions, permissionId];
    
    setFormData({ ...formData, permissions: newPermissions });
  };

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
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="Member">Member</option>
              <option value="President">President</option>
              <option value="Vice-President">Vice-President</option>
              <option value="Secretary">Secretary</option>
              <option value="Treasurer">Treasurer</option>
              <option value="Communications">Communications</option>
              <option value="Former-Member">Former Member</option>
            </select>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="fullAccess"
              checked={formData.fullAccessOverride}
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

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Permissions</h3>
        <div className="space-y-3">
          {AVAILABLE_PERMISSIONS.map((permission) => (
            <div key={permission.id} className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={permission.id}
                checked={formData.permissions.includes(permission.id)}
                onChange={() => togglePermission(permission.id)}
                disabled={formData.fullAccessOverride}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary/20 disabled:opacity-50"
              />
              <label 
                htmlFor={permission.id} 
                className={`text-sm ${formData.fullAccessOverride ? 'text-gray-400' : 'text-gray-700'}`}
              >
                {permission.label}
              </label>
            </div>
          ))}
        </div>

        {formData.fullAccessOverride && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Full Access Override is enabled. Individual permissions are ignored when this option is active.
            </p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Role Guidelines</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• <strong>President:</strong> Full access to all systems including restricted files</li>
          <li>• <strong>Vice-President:</strong> Complete administrative access except restricted files</li>
          <li>• <strong>Secretary:</strong> Administrative access plus financial document access</li>
          <li>• <strong>Treasurer:</strong> Financial focus with selective administrative permissions</li>
          <li>• <strong>Communications:</strong> Communication tools and content management</li>
          <li>• <strong>Member:</strong> Basic member permissions only</li>
        </ul>
      </div>
    </div>
  );
}