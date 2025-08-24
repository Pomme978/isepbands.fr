// components/dashboard/RecentActivity.tsx
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ActivityType } from '@/types/activity';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
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

const getActivityLabel = (type: ActivityType['type']) => {
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
    case 'system_announcement':
      return 'Annonce système';
    default:
      return 'Activité';
  }
};

const ActivityItem = ({ activity }: { activity: ActivityType }) => {
  const timeAgo = formatDistanceToNow(activity.timestamp, {
    addSuffix: true,
    locale: fr,
  });

  const isSystemMessage = activity.isSystemMessage || !activity.user;

  // Pour les nouveaux membres, extraire le nom du membre depuis la description
  const getNewMemberName = (description: string) => {
    const match = description.match(/^(.+?)\s+vient de rejoindre|^(.+?)\s+a rejoint/);
    return match ? match[1] || match[2] : null;
  };

  const getNewMemberAvatar = (memberName: string) => {
    // Générer un avatar par défaut basé sur le nom
    const firstLetter = memberName.charAt(0).toUpperCase();
    return firstLetter;
  };

  return (
    <div className="flex space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      {/* Avatar */}
      <Avatar className="h-10 w-10 flex-shrink-0">
        {isSystemMessage ? (
          activity.type === 'new_member' ? (
            <AvatarFallback className="bg-green-500 text-white">
              {getNewMemberAvatar(getNewMemberName(activity.description) || 'N')}
            </AvatarFallback>
          ) : (
            <AvatarFallback className="bg-gray-500 text-white">
              {getActivityIcon(activity.type)}
            </AvatarFallback>
          )
        ) : (
          <>
            <AvatarImage src={activity.user?.avatar} />
            <AvatarFallback className="bg-blue-500 text-white">
              {activity.user?.name?.charAt(0) || '?'}
            </AvatarFallback>
          </>
        )}
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          {!isSystemMessage && (
            <>
              <h5 className="font-semibold text-sm text-gray-900">{activity.user?.name}</h5>
              {activity.user?.role && (
                <Badge variant="outline" className="text-xs">
                  {activity.user.role}
                </Badge>
              )}
            </>
          )}
          <div className="flex items-center space-x-1 text-gray-500">
            {!isSystemMessage && getActivityIcon(activity.type)}
            <span className="text-xs">{getActivityLabel(activity.type)}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>

        {/* Images for posts with images */}
        {activity.type === 'post_with_image' && activity.images && activity.images.length > 0 && (
          <div className="mb-3">
            <div className="grid grid-cols-2 gap-2 max-w-xs">
              {activity.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="rounded-lg w-full h-24 object-cover"
                />
              ))}
            </div>
          </div>
        )}

        {/* Single image fallback (for backward compatibility) */}
        {activity.type === 'post_with_image' && activity.image && !activity.images && (
          <div className="mb-3">
            <img
              src={activity.image}
              alt="Post image"
              className="rounded-lg max-w-full h-32 object-cover"
            />
          </div>
        )}

        {/* Action buttons for specific activity types */}
        {activity.type === 'event' && (
          <div className="mb-2">
            <button className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs rounded-md border border-red-200 transition-colors">
              Voir l'événement
            </button>
          </div>
        )}

        {activity.type === 'new_group' && (
          <div className="mb-2">
            <button className="px-3 py-1 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs rounded-md border border-orange-200 transition-colors">
              Rejoindre le groupe
            </button>
          </div>
        )}

        {/* Only show comments count (no likes) */}
        {activity.comments && (
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <span>💬 {activity.comments}</span>
          </div>
        )}

        <p className="text-xs text-gray-400">{timeAgo}</p>
      </div>
    </div>
  );
};

interface RecentActivityProps {
  activities: ActivityType[];
  onShowHistory?: () => void;
}

export const RecentActivity = ({ activities, onShowHistory }: RecentActivityProps) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Aucune activité récente</p>
      </div>
    );
  }

  // Afficher seulement les 6 dernières activités
  const recentActivities = activities.slice(0, 6);
  const hasMore = activities.length > 6;

  return (
    <div className="space-y-1">
      {recentActivities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}

      {hasMore && onShowHistory && (
        <div className="pt-4 border-t border-gray-200 mt-4">
          <button
            onClick={onShowHistory}
            className="w-full py-2 px-4 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
          >
            Voir l'historique complet ({activities.length - 6} activités supplémentaires)
          </button>
        </div>
      )}
    </div>
  );
};
