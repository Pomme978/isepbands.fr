'use client';

import { ProfileSettings } from './ProfileSettings';
import { MusicSettings } from './MusicSettings';
import { PrivacySettings } from './PrivacySettings';

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

      case 'privacy':
        return <PrivacySettings />;

      default:
        return <ProfileSettings />;
    }
  };

  return <>{renderContent()}</>;
}
