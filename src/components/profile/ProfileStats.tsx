// @components/profile/ProfileStats.tsx
'use client';

import { Users, Music, CalendarDays } from 'lucide-react';

interface ProfileStatsProps {
  totalGroups: number;
  instrumentCount: number;
  eventsAttended: number;
}

export default function ProfileStats({
  totalGroups,
  instrumentCount,
  eventsAttended,
}: ProfileStatsProps) {
  return (
    <div className="flex gap-6 text-sm flex-wrap">
      {totalGroups > 0 && (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span>
            <strong>{totalGroups}</strong> groupe{totalGroups > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {instrumentCount > 0 && (
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4 text-primary" />
          <span>
            <strong>{instrumentCount}</strong> instrument{instrumentCount > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {eventsAttended > 0 && (
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span>
            <strong>{eventsAttended}</strong> événement{eventsAttended > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}
