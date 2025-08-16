'use client';

import { useState } from 'react';
import BackButton from '@/components/ui/back-button';
import { SettingsSidebar } from '@/components/profile/settings/SettingsSidebar';
import { SettingsContent } from '@/components/profile/settings/SettingsContent';

export default function ProfileSettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');

  return (
    <div className="h-screen max-w-7xl flex flex-col">
      {/* Header avec back button */}
      <div className="px-6 py-4 flex-shrink-0">
        <BackButton variant="ghost" />
      </div>

      {/* Layout principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SettingsSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

        {/* Contenu principal - scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <SettingsContent activeSection={activeSection} />
          </div>
        </div>
      </div>
    </div>
  );
}
