'use client';

import { cn } from '@/utils/utils';
import { User, Music, Bell, Shield, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingsItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
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

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  return (
    <div className="w-64 flex-shrink-0 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-foreground">Paramètres</h2>
      </div>

      <div className="px-4 pb-4">
        <div className="space-y-2">
          {settingsItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? 'primary' : 'ghost'}
              className={cn(
                'w-full justify-start h-12 hover:bg-primary/50 hover:text-white',
                activeSection === item.id &&
                  'bg-primary text-primary-foreground hover:bg-primary/80',
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              <span className="font-medium">{item.title}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
