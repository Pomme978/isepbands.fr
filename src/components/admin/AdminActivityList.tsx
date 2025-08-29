'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { ActivityType } from '@/types/activity';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';
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
} from 'lucide-react';

interface AdminActivityListProps {
  activities: ActivityType[];
  onEdit?: (activityId: string) => void;
  onDelete?: (activityId: string) => void;
  currentUserId?: string;
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

interface AdminActivityItemProps {
  activity: ActivityType & { createdBy?: string };
  onEdit?: (activityId: string) => void;
  onDelete?: (activityId: string) => void;
  currentUserId?: string;
}

const AdminActivityItem = ({
  activity,
  onEdit,
  onDelete,
  currentUserId,
}: AdminActivityItemProps) => {
  const timeAgo = formatDistanceToNow(activity.timestamp, {
    addSuffix: true,
    locale: fr,
  });

  const isSystemMessage = activity.isSystemMessage || !activity.user;
  const canEdit = !isSystemMessage && activity.createdBy === currentUserId && onEdit;
  const canDelete = !isSystemMessage && onDelete;

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
      {activity.title && (
        <h3 className="font-bold text-lg md:text-base text-gray-900">{activity.title}</h3>
      )}

      {/* Description */}
      {activity.description && (
        <p className="text-base md:text-sm text-gray-600 mb-4">{activity.description}</p>
      )}

      {/* Informations utilisateur sur une ligne avec séparation gauche/droite */}
      <div className="flex items-center justify-between mt-2">
        {/* Gauche: Avatar + Nom + Rôle */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
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

          <div className="flex items-center space-x-2 text-base md:text-sm">
            {!isSystemMessage && (
              <>
                <span className="font-medium text-gray-900">{activity.user?.name}</span>
                {activity.user?.role && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {activity.user.role}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Droite: Type d'activité + Heure + Boutons d'action */}
        <div className="flex items-center space-x-2 text-base md:text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            {!isSystemMessage && getActivityIcon(activity.type)}
            <span className="text-sm md:text-xs">{getActivityLabel(activity.type)}</span>
          </div>
          <span className="text-gray-400">•</span>
          <span className="text-sm md:text-xs text-gray-400">{timeAgo}</span>

          {/* Boutons d'administration */}
          {(canEdit || canDelete) && (
            <>
              <span className="text-gray-400">•</span>
              <div className="flex gap-1">
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit!(activity.id)}
                    className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                )}
                {canDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete!(activity.id)}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </>
          )}
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

export const AdminActivityList = ({
  activities,
  onEdit,
  onDelete,
  currentUserId,
  maxItems,
}: AdminActivityListProps) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Aucune activité récente</p>
      </div>
    );
  }

  const displayActivities = maxItems ? activities.slice(0, maxItems) : activities;

  return (
    <div className="space-y-1">
      {displayActivities.map((activity) => (
        <AdminActivityItem
          key={activity.id}
          activity={activity as ActivityType & { createdBy?: string }}
          onEdit={onEdit}
          onDelete={onDelete}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};
