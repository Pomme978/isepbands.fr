// @components/settings/ProfileStats.tsx
import { Users, Music, CalendarDays } from 'lucide-react';
import { useI18n } from '@/locales/client';

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
  const t = useI18n();
  return (
    <div className="flex gap-6 text-sm flex-wrap">
      {totalGroups > 0 && (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span>
            <strong>{totalGroups}</strong>{' '}
            {totalGroups > 1 ? t('user.profile.stats.groups') : t('user.profile.stats.group')}
          </span>
        </div>
      )}

      {instrumentCount > 0 && (
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4 text-primary" />
          <span>
            <strong>{instrumentCount}</strong>{' '}
            {instrumentCount > 1
              ? t('user.profile.stats.instruments')
              : t('user.profile.stats.instrument')}
          </span>
        </div>
      )}

      {eventsAttended > 0 && (
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span>
            <strong>{eventsAttended}</strong>{' '}
            {eventsAttended > 1 ? t('user.profile.stats.events') : t('user.profile.stats.event')}
          </span>
        </div>
      )}
    </div>
  );
}
