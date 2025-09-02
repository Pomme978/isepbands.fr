'use client';

import { cn } from '@/utils/utils';
import { User, Music, Shield, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';

interface SettingsItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onSave: () => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}

const settingsItems: SettingsItem[] = [
  {
    id: 'profile',
    title: 'Profil',
    icon: User,
  },
  {
    id: 'music',
    title: 'Musique',
    icon: Music,
  },
  {
    id: 'privacy',
    title: 'Confidentialité',
    icon: Shield,
  },
];

export function SettingsSidebar({
  activeSection,
  onSectionChange,
  onSave,
  isSaving,
  hasUnsavedChanges,
}: SettingsSidebarProps) {
  return (
    <div className="w-full md:w-64 flex-shrink-0 overflow-y-auto flex flex-col md:border-r border-gray-200">
      <div className="p-4 md:p-6">
        <h2 className="text-lg font-semibold text-foreground">Paramètres</h2>
      </div>

      <div className="px-4 flex-1">
        {/* Mobile: horizontal scroll, Desktop: vertical stack */}
        <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {settingsItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? 'primary' : 'ghost'}
              className={cn(
                'flex-shrink-0 md:w-full justify-start h-12 hover:bg-primary/50 hover:text-white whitespace-nowrap',
                activeSection === item.id &&
                  'bg-primary text-primary-foreground hover:bg-primary/80',
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <item.icon className="mr-2 md:mr-3 h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{item.title}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Save button at the bottom */}
      <div className="p-4 border-t md:border-t border-gray-200">
        <Button
          onClick={onSave}
          disabled={!hasUnsavedChanges || isSaving}
          className={cn(
            'w-full h-12',
            hasUnsavedChanges
              ? 'bg-primary hover:bg-primary/90 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed',
          )}
        >
          {isSaving ? (
            <>
              <Loading text="" size="sm" centered={false} />
              <span className="ml-2 hidden sm:inline">Enregistrement...</span>
              <span className="ml-2 sm:hidden">...</span>
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5 flex-shrink-0" />
              <span className="hidden sm:inline">Enregistrer les modifications</span>
              <span className="sm:hidden">Enregistrer</span>
            </>
          )}
        </Button>
        {hasUnsavedChanges && !isSaving && (
          <p className="text-xs text-orange-600 mt-2 text-center">
            <span className="hidden sm:inline">Des modifications non sauvegardées</span>
            <span className="sm:hidden">Non sauvegardé</span>
          </p>
        )}
      </div>
    </div>
  );
}
