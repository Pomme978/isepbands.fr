// @components/settings/GroupsSection.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';
import GroupCard from './GroupCard';
import EmptyState from './EmptyState';
import { useI18n } from '@/locales/client';

interface GroupRole {
  role: string;
  isPrimary: boolean;
}

interface Group {
  id: string;
  name: string;
  image: string;
  roles: GroupRole[];
  joinDate: string;
  isActive: boolean;
  inactiveSince?: string;
  memberCount: number;
  maxMembers: number;
  slug: string;
  genre?: string;
  concertCount: number; // Champ ajouté pour correspondre à GroupCard
  nextEvent?: {
    type: 'concert' | 'rehearsal' | 'jam';
    date: string;
    venue?: string;
  };
  isRecruiting?: boolean;
}

interface GroupsSectionProps {
  groups: Group[];
  onGroupClick: (slug: string) => void;
}

export default function GroupsSection({ groups, onGroupClick }: GroupsSectionProps) {
  const t = useI18n();
  const activeGroups = groups.filter((group: Group) => group.isActive);
  const inactiveGroups = groups.filter((group: Group) => !group.isActive);

  return (
    <Card className="p-6 border-0 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <Users className="h-6 w-6 text-primary" />
        {t('user.profile.groups.title')}
      </h2>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('user.profile.groups.coming_soon_title')}
          </h3>
          <p className="text-gray-600 max-w-sm mx-auto">
            {t('user.profile.groups.coming_soon_description')}
          </p>
        </div>
      </div>
    </Card>
  );
}
