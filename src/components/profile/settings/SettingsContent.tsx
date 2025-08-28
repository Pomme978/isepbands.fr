'use client';

import { ProfileSettings } from './ProfileSettings';
import { MusicSettings } from './MusicSettings';
import { PrivacySettings } from './PrivacySettings';

interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  biography?: string;
  photoUrl?: string | null;
  isLookingForGroup?: boolean;
  pronouns?: string | null;
  promotion?: string | null;
  status?: string;
}

interface SettingsContentProps {
  activeSection: string;
  userProfile?: UserProfile;
  currentUserId?: string;
  formData?: Record<string, unknown>;
  onFormDataChange?: (section: string, data: Record<string, unknown>) => void;
  onPendingPhotoChange?: (file: File | null) => void;
}

export function SettingsContent({
  activeSection,
  userProfile,
  currentUserId,
  formData,
  onFormDataChange,
  onPendingPhotoChange,
}: SettingsContentProps) {
  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <ProfileSettings
            initialProfile={userProfile}
            currentUserId={currentUserId}
            formData={formData?.profile}
            onFormDataChange={(data) => onFormDataChange?.('profile', data)}
            onPendingPhotoChange={onPendingPhotoChange}
          />
        );

      case 'music':
        return (
          <MusicSettings
            formData={formData?.music}
            onFormDataChange={(data) => onFormDataChange?.('music', data)}
          />
        );

      case 'privacy':
        return (
          <PrivacySettings
            formData={formData?.privacy}
            onFormDataChange={(data) => onFormDataChange?.('privacy', data)}
          />
        );

      default:
        return (
          <ProfileSettings
            initialProfile={userProfile}
            currentUserId={currentUserId}
            formData={formData?.profile}
            onFormDataChange={(data) => onFormDataChange?.('profile', data)}
            onPendingPhotoChange={onPendingPhotoChange}
          />
        );
    }
  };

  return <>{renderContent()}</>;
}
