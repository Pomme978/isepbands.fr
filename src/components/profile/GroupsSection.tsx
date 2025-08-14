// @components/profile/GroupsSection.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';
import GroupCard from './GroupCard';
import EmptyState from './EmptyState';

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
  const activeGroups = groups.filter((group) => group.isActive);
  const inactiveGroups = groups.filter((group) => !group.isActive);

  return (
    <Card className="p-6 border-0 h-fit">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <Users className="h-6 w-6 text-primary" />
        Groupes
      </h2>

      <div className="space-y-4">
        {/* Active Groups */}
        {activeGroups.map((group) => (
          <GroupCard key={group.id} group={group} onClick={() => onGroupClick(group.slug)} />
        ))}

        {/* Separator for inactive groups */}
        {inactiveGroups.length > 0 && activeGroups.length > 0 && (
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 py-1 text-xs text-gray-500 bg-gray-50 rounded">
              Groupes Inactifs
            </span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
        )}

        {/* Inactive Groups */}
        {inactiveGroups.map((group) => (
          <GroupCard key={group.id} group={group} onClick={() => onGroupClick(group.slug)} />
        ))}

        {groups.length === 0 && (
          <EmptyState
            icon={Users}
            title="N'a rejoint aucun groupe pour le moment"
            description="Les groupes apparaîtront ici une fois rejoint !"
          />
        )}
      </div>
    </Card>
  );
}
