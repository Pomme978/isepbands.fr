'use client';

import { ProfileSettings } from './ProfileSettings';
import { MusicSettings } from './MusicSettings';
import { NotificationsSettings } from './NotificationsSettings';
import { PrivacySettings } from './PrivacySettings';
import { PreferencesSettings } from './PreferencesSettings';

interface SettingsContentProps {
  activeSection: string;
}

export function SettingsContent({ activeSection }: SettingsContentProps) {
  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings />;

      case 'music':
        return <MusicSettings />;

      case 'notifications':
        return <NotificationsSettings />;

      case 'privacy':
        return <PrivacySettings />;

      case 'preferences':
        return <PreferencesSettings />;

      default:
        return <ProfileSettings />;
    }
  };

  return <>{renderContent()}</>;
}
