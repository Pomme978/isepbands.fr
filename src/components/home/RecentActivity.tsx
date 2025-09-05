'use client';

import Avatar from '@/components/common/Avatar';
import type { ActivityType } from '@/types/activity';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import Image from 'next/image';
import { useI18n } from '@/locales/client';
import { useLang } from '@/hooks/useLang';
import BadgeDisplay from '@/components/profile/BadgeDisplay';
import {
  Users,
  MessageSquare,
  Calendar,
  Megaphone,
  UserPlus,
  Image as ImageIcon,
  Settings,
} from 'lucide-react';

interface RecentActivityProps {
  activities: ActivityType[];
  onShowHistory?: () => void;
  showHistoryButton?: boolean;
  maxItems?: number;
}

const getActivityIcon = (type: ActivityType['type']) => {
  switch (type) {
    case 'new_member':
      return <UserPlus className="h-4 w-4 text-green-600" />;
    case 'post':
      return <MessageSquare className="h-4 w-4 text-blue-600" />;
    case 'post_with_image':
      return <ImageIcon className="h-4 w-4 text-purple-600" />;
    case 'new_group':
      return <Users className="h-4 w-4 text-orange-600" />;
    case 'event':
      return <Calendar className="h-4 w-4 text-red-600" />;
    case 'announcement':
      return <Megaphone className="h-4 w-4 text-yellow-600" />;
    case 'system_announcement':
      return <Settings className="h-4 w-4 text-gray-600" />;
    default:
      return <MessageSquare className="h-4 w-4 text-gray-600" />;
  }
};

const getActivityLabel = (type: ActivityType['type'], t: (key: string) => string) => {
  switch (type) {
    case 'new_member':
      return t('page.activities.labels.new_member');
    case 'post':
      return t('page.activities.labels.post');
    case 'post_with_image':
      return t('page.activities.labels.post_with_image');
    case 'new_group':
      return t('page.activities.labels.new_group');
    case 'event':
      return t('page.activities.labels.event');
    case 'announcement':
      return t('page.activities.labels.announcement');
    case 'system_announcement':
      return t('page.activities.labels.system_announcement');
    default:
      return t('page.activities.labels.default');
  }
};

const ActivityItem = ({ activity }: { activity: ActivityType }) => {
  const t = useI18n();
  const { lang } = useLang();

  const timeAgo = formatDistanceToNow(activity.timestamp, {
    addSuffix: true,
    locale: lang === 'fr' ? fr : enUS,
  });

  const isSystemMessage = activity.isSystemMessage || !activity.user;

  const getNewMemberName = (description: string) => {
    const match = description.match(/^(.+?)\s+vient de rejoindre|^(.+?)\s+a rejoint/);
    return match ? match[1] || match[2] : null;
  };

  const getNewMemberAvatar = (memberName: string) => {
    return memberName.charAt(0).toUpperCase();
  };

  return (
    <div className="px-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors mb-3 md:mb-4">
      {/* Titre en gras si présent - plus gros */}
      {activity.title && (
        <h3 className="font-bold text-base md:text-lg text-gray-900">{activity.title}</h3>
      )}

      {/* Description */}
      {activity.description && (
        <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">{activity.description}</p>
      )}

      {/* Informations utilisateur sur une ligne avec séparation gauche/droite */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mt-2">
        {/* Gauche: Avatar + Nom + Rôle */}
        <div className="flex items-center space-x-3">
          {isSystemMessage ? (
            <div className="h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center bg-gray-500 text-white">
              {activity.type === 'new_member'
                ? getNewMemberAvatar(getNewMemberName(activity.description) || 'N')
                : getActivityIcon(activity.type)}
            </div>
          ) : (
            <Avatar
              src={activity.user?.avatar}
              name={activity.user?.name || t('page.activities.unknownUser')}
              size="sm"
              className="flex-shrink-0"
            />
          )}

          <div className="flex items-center space-x-2 text-xs md:text-sm">
            {!isSystemMessage && (
              <>
                <span className="font-medium text-gray-900">{activity.user?.name}</span>
                {activity.user?.role && (
                  <BadgeDisplay
                    role={activity.user.role}
                    badges={[]}
                    isLookingForGroup={false}
                    pronouns="they/them"
                    size="xs"
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Droite: Type d'activité + Heure */}
        <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            {!isSystemMessage && getActivityIcon(activity.type)}
            <span className="text-xs">{getActivityLabel(activity.type, t)}</span>
          </div>
          <span className="text-gray-400">•</span>
          <span className="text-xs text-gray-400">{timeAgo}</span>
        </div>
      </div>

      {/* Images et contenu supplémentaire */}
      {activity.type === 'post_with_image' && activity.images && activity.images.length > 0 && (
        <div className="mt-3 mb-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xs">
            {activity.images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                width={96}
                height={96}
                className="rounded-lg w-full h-20 md:h-24 object-cover"
              />
            ))}
          </div>
        </div>
      )}

      {activity.type === 'post_with_image' && activity.image && !activity.images && (
        <div className="mt-3 mb-3">
          <Image
            src={activity.image}
            alt="Post image"
            width={200}
            height={128}
            className="rounded-lg max-w-full h-24 md:h-32 object-cover"
          />
        </div>
      )}

      {activity.type === 'event' && (
        <div className="mt-3">
          <button className="px-2 md:px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs rounded-md border border-red-200 transition-colors">
            Voir l&apos;événement
          </button>
        </div>
      )}

      {activity.type === 'new_group' && (
        <div className="mt-3">
          <button className="px-2 md:px-3 py-1 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs rounded-md border border-orange-200 transition-colors">
            Voir le groupe
          </button>
        </div>
      )}

      {activity.comments && (
        <div className="flex items-center text-xs text-gray-500 mt-3">
          <span>💬 {activity.comments}</span>
        </div>
      )}
    </div>
  );
};

export const RecentActivity = ({
  activities,
  onShowHistory,
  showHistoryButton = true,
  maxItems = 6,
}: RecentActivityProps) => {
  const t = useI18n();

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>{t('page.activities.noActivity')}</p>
      </div>
    );
  }

  const recentActivities = activities.slice(0, maxItems);
  const hasMore = activities.length > maxItems;

  return (
    <div className="space-y-2 md:space-y-1">
      {recentActivities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}

      {hasMore && showHistoryButton && onShowHistory && (
        <div className="pt-3 md:pt-4 border-t border-gray-200 mt-3 md:mt-4">
          <button
            onClick={onShowHistory}
            className="w-full py-2 px-3 md:px-4 text-xs md:text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
          >
            {t('page.activities.showHistory')} (
            {t('page.activities.moreActivities', { count: activities.length - maxItems })})
          </button>
        </div>
      )}
    </div>
  );
};
