'use client';

import { useState } from 'react';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { UserFormData } from '../CreateUserModal';

interface Step6ReviewProps {
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
}

export default function Step6Review({ formData, setFormData }: Step6ReviewProps) {
  const [showPassword, setShowPassword] = useState(false);

  const generateNewPassword = () => {
    const newPassword = Math.random().toString(36).slice(-10);
    setFormData({ ...formData, temporaryPassword: newPassword });
  };

  const updateAccountSetting = (field: string, value: boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
      {children}
    </div>
  );

  const InfoRow = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
    <div className="flex justify-between items-start py-1">
      <span className="text-sm text-gray-600 font-medium">{label}:</span>
      <span className="text-sm text-gray-900 text-right flex-1 ml-4">
        {typeof value === 'string' ? value || <em className="text-gray-400">Not specified</em> : value}
      </span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Review User Information</h3>
        <p className="text-gray-600">
          Please review all information before creating the user account. 
          You can go back to any step to make changes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <InfoSection title="Personal Information">
          <div className="space-y-1">
            <InfoRow label="Name" value={`${formData.firstName} ${formData.lastName}`} />
            <InfoRow label="Email" value={formData.email} />
            <InfoRow label="Birth Date" value={formData.birthDate} />
            <InfoRow label="Promotion" value={formData.promotion} />
            <InfoRow label="Student Status" value={formData.studentStatus} />
          </div>
        </InfoSection>

        {/* Role & Permissions */}
        <InfoSection title="Role & Permissions">
          <div className="space-y-1">
            <InfoRow label="Primary Role" value={formData.primaryRole} />
            <InfoRow 
              label="Full Access" 
              value={formData.isFullAccess ? "Yes" : "No"} 
            />
            {!formData.isFullAccess && (
              <InfoRow 
                label="Permissions" 
                value="Based on role permissions"
              />
            )}
          </div>
        </InfoSection>

        {/* Instruments & Skills */}
        <InfoSection title="Instruments & Skills">
          <div className="space-y-1">
            <InfoRow 
              label="Instruments" 
              value={
                formData.instruments.length > 0 
                  ? <span className="text-xs">{formData.instruments.length} instruments</span>
                  : "None specified"
              } 
            />
            <InfoRow label="Experience" value={`${formData.yearsExperience || '0'} years`} />
            <InfoRow 
              label="Genres" 
              value={
                formData.preferredGenres.length > 0 
                  ? <span className="text-xs">{formData.preferredGenres.length} selected</span>
                  : "None selected"
              } 
            />
          </div>
        </InfoSection>

        {/* Badges */}
        <InfoSection title="Badges & Recognition">
          <div className="space-y-1">
            <InfoRow 
              label="Achievement Badges" 
              value={
                formData.achievementBadges.length > 0 
                  ? <span className="text-xs">{formData.achievementBadges.length} badges</span>
                  : "None selected"
              } 
            />
            <InfoRow 
              label="Custom Badge" 
              value={formData.customBadge ? formData.customBadge.name : "None"} 
            />
          </div>
        </InfoSection>

        {/* Profile Information */}
        <InfoSection title="Profile Information">
          <div className="space-y-1">
            <InfoRow 
              label="Profile Photo" 
              value={formData.profilePhoto ? "Uploaded" : "Not uploaded"} 
            />
            <InfoRow 
              label="Public Profile" 
              value={formData.publicProfile ? "Yes" : "No"} 
            />
            <InfoRow 
              label="Bio" 
              value={formData.bio ? "Added" : "None"} 
            />
          </div>
        </InfoSection>

        {/* Email Preferences */}
        <InfoSection title="Email Preferences">
          <div className="space-y-1">
            <InfoRow label="Newsletter" value={formData.emailPreferences.newsletter ? "Yes" : "No"} />
            <InfoRow label="Events" value={formData.emailPreferences.events ? "Yes" : "No"} />
            <InfoRow label="Group Invitations" value={formData.emailPreferences.groupInvitations ? "Yes" : "No"} />
            <InfoRow label="System Updates" value={formData.emailPreferences.systemUpdates ? "Yes" : "No"} />
          </div>
        </InfoSection>
      </div>

      {/* Account Setup */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-4">Account Setup</h4>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="sendWelcomeEmail"
              checked={formData.sendWelcomeEmail}
              onChange={(e) => updateAccountSetting('sendWelcomeEmail', e.target.checked)}
              className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary/20"
            />
            <div>
              <label htmlFor="sendWelcomeEmail" className="text-sm font-medium text-blue-900">
                Send Welcome Email
              </label>
              <p className="text-xs text-blue-700">
                Send an email with login instructions and temporary password
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-900 mb-2">
              Temporary Password
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.temporaryPassword}
                  onChange={(e) => setFormData({ ...formData, temporaryPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                type="button"
                onClick={generateNewPassword}
                className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
                title="Generate new password"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="requirePasswordChange"
              checked={formData.requirePasswordChange}
              onChange={(e) => updateAccountSetting('requirePasswordChange', e.target.checked)}
              className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary/20"
            />
            <div>
              <label htmlFor="requirePasswordChange" className="text-sm font-medium text-blue-900">
                Require Password Change on First Login
              </label>
              <p className="text-xs text-blue-700">
                User must change password when logging in for the first time
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final Actions Preview */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>✅ User account will be created with the specified information</li>
          {formData.sendWelcomeEmail && <li>📧 Welcome email will be sent to {formData.email}</li>}
          <li>🔗 You'll receive a link to view the user's profile</li>
          <li>👤 User can be added to groups if needed</li>
        </ul>
      </div>
    </div>
  );
}