'use client';

import Avatar from '@/components/common/Avatar';
import { Badge } from '@/components/ui/badge';
import type { PublicFeedType } from '@/types/publicFeed';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';
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
  activities: PublicFeedType[];
  onShowHistory?: () => void;
  showHistoryButton?: boolean;
  maxItems?: number;
}

const getActivityIcon = (type: PublicFeedType['type']) => {
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
    // system_announcement removed from public feed
    default:
      return <MessageSquare className="h-4 w-4 text-gray-600" />;
  }
};

const getActivityLabel = (type: PublicFeedType['type']) => {
  switch (type) {
    case 'new_member':
      return 'Nouveau membre';
    case 'post':
      return 'Publication';
    case 'post_with_image':
      return 'Publication avec image';
    case 'new_group':
      return 'Nouveau groupe';
    case 'event':
      return 'Événement';
    case 'announcement':
      return 'Annonce';
    // system_announcement removed from public feed
    default:
      return 'Activité';
  }
};

const ActivityItem = ({ activity }: { activity: PublicFeedType }) => {
  const timeAgo = formatDistanceToNow(activity.timestamp, {
    addSuffix: true,
    locale: fr,
  });

  // Public feed never has system messages - all activities have users
  const isSystemMessage = false;

  const getNewMemberName = (description: string) => {
    const match = description.match(/^(.+?)\s+vient de rejoindre|^(.+?)\s+a rejoint/);
    return match ? match[1] || match[2] : null;
  };

  const getNewMemberAvatar = (memberName: string) => {
    return memberName.charAt(0).toUpperCase();
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors mb-4">
      {/* Titre en gras si présent - plus gros */}
      {activity.title && <h3 className="font-bold text-lg text-gray-900">{activity.title}</h3>}

      {/* Description */}
      {activity.description && <p className="text-md text-gray-600 mb-4">{activity.description}</p>}

      {/* Informations utilisateur sur une ligne avec séparation gauche/droite */}
      <div className="flex items-center justify-between mt-2">
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
              src={activity.user.avatar}
              name={activity.user.name}
              size="sm"
              className="flex-shrink-0"
            />
          )}

          <div className="flex items-center space-x-2 text-sm">
            {/* Public feed always has user info */}
            <span className="font-medium text-gray-900">{activity.user.name}</span>
            {activity.user.role && (
              <BadgeDisplay 
                role={activity.user.role}
                badges={[]}
                isLookingForGroup={false}
                pronouns="they/them"
                size="xs"
              />
            )}
          </div>
        </div>

        {/* Droite: Type d'activité + Heure */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            {getActivityIcon(activity.type)}
            <span className="text-xs">{getActivityLabel(activity.type)}</span>
          </div>
          <span className="text-gray-400">•</span>
          <span className="text-xs text-gray-400">{timeAgo}</span>
        </div>
      </div>

      {/* Images et contenu supplémentaire */}
      {activity.type === 'post_with_image' && activity.images && activity.images.length > 0 && (
        <div className="mt-3 mb-3">
          <div className="grid grid-cols-2 gap-2 max-w-xs">
            {activity.images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                width={96}
                height={96}
                className="rounded-lg w-full h-24 object-cover"
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
            className="rounded-lg max-w-full h-32 object-cover"
          />
        </div>
      )}

      {activity.type === 'event' && (
        <div className="mt-3">
          <button className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs rounded-md border border-red-200 transition-colors">
            Voir l&apos;événement
          </button>
        </div>
      )}

      {activity.type === 'new_group' && (
        <div className="mt-3">
          <button className="px-3 py-1 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs rounded-md border border-orange-200 transition-colors">
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
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Aucune activité récente</p>
      </div>
    );
  }

  const recentActivities = activities.slice(0, maxItems);
  const hasMore = activities.length > maxItems;

  return (
    <div className="space-y-1">
      {recentActivities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}

      {hasMore && showHistoryButton && onShowHistory && (
        <div className="pt-4 border-t border-gray-200 mt-4">
          <button
            onClick={onShowHistory}
            className="w-full py-2 px-4 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
          >
            Voir l&apos;historique complet ({activities.length - maxItems} activités
            supplémentaires)
          </button>
        </div>
      )}
    </div>
  );
};
