'use client';

import Avatar from '@/components/common/Avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ActivityType } from '@/types/activity';
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
  Edit,
  Trash2,
  XCircle,
} from 'lucide-react';

interface PublicFeedType {
  id: string;
  type: 'new_member' | 'post' | 'event' | 'announcement' | 'post_with_image';
  timestamp: Date;
  title?: string;
  description: string;
  user?: {
    name: string;
    avatar: string;
    role?: string;
  };
  images?: string[];
}

interface AdminRecentActivityProps {
  activities: PublicFeedType[];
  maxItems?: number;
  currentUser?: { id: string } | null;
  onEdit?: (activity: any) => void;
  onArchive?: (activityId: string) => void;
  onDelete?: (activityId: string) => void;
  rawActivities?: any[]; // For access to createdBy info
}

const getActivityIcon = (type: PublicFeedType['type']) => {
  switch (type) {
    case 'new_member':
      return <UserPlus className="h-4 w-4 text-green-600" />;
    case 'post':
      return <MessageSquare className="h-4 w-4 text-blue-600" />;
    case 'post_with_image':
      return <ImageIcon className="h-4 w-4 text-purple-600" />;
    case 'event':
      return <Calendar className="h-4 w-4 text-red-600" />;
    case 'announcement':
      return <Megaphone className="h-4 w-4 text-yellow-600" />;
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
      return 'Photo';
    case 'event':
      return 'Événement';
    case 'announcement':
      return 'Annonce';
    default:
      return 'Activité';
  }
};

function ActivityItem({
  activity,
  currentUser,
  onEdit,
  onArchive,
  onDelete,
  rawActivity,
}: {
  activity: PublicFeedType;
  currentUser?: { id: string } | null;
  onEdit?: (activity: any) => void;
  onArchive?: (activityId: string) => void;
  onDelete?: (activityId: string) => void;
  rawActivity?: any;
}) {
  const timeAgo = formatDistanceToNow(activity.timestamp, {
    addSuffix: true,
    locale: fr,
  });

  const isSystemMessage = activity.type === 'new_member';

  // Check if current user can edit this activity
  const canEdit =
    currentUser &&
    rawActivity &&
    rawActivity.createdBy === currentUser.id &&
    activity.type === 'post';

  return (
    <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors mb-4 relative">
      {/* Action buttons - top right */}
      {canEdit && (
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit && onEdit(rawActivity)}
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onArchive && onArchive(activity.id)}
            className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete && onDelete(activity.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Titre en gras si présent - plus gros */}
      {activity.title && (
        <h3 className="font-bold text-lg text-gray-900 pr-24">{activity.title}</h3>
      )}

      {/* Description */}
      {activity.description && (
        <p className="text-md text-gray-600 mb-4 pr-24">{activity.description}</p>
      )}

      {/* Informations utilisateur sur une ligne avec séparation gauche/droite */}
      <div className="flex items-center justify-between mt-2">
        {/* Gauche: Avatar + Nom + Rôle */}
        <div className="flex items-center space-x-3">
          {isSystemMessage ? (
            <div className="h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center bg-gray-500 text-white">
              {getActivityIcon(activity.type)}
            </div>
          ) : (
            <Avatar
              src={activity.user?.avatar}
              name={activity.user?.name || 'Utilisateur inconnu'}
              size="sm"
              className="flex-shrink-0"
            />
          )}

          <div className="flex items-center space-x-2 text-sm">
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
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            {!isSystemMessage && getActivityIcon(activity.type)}
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
    </div>
  );
}

export function AdminRecentActivity({
  activities,
  maxItems = 10,
  currentUser,
  onEdit,
  onArchive,
  onDelete,
  rawActivities = [],
}: AdminRecentActivityProps) {
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div>
      {displayedActivities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Aucune activité récente</p>
          <p className="text-sm">Les dernières publications apparaîtront ici</p>
        </div>
      ) : (
        displayedActivities.map((activity, index) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            currentUser={currentUser}
            onEdit={onEdit}
            onArchive={onArchive}
            onDelete={onDelete}
            rawActivity={rawActivities[index]}
          />
        ))
      )}
    </div>
  );
}
