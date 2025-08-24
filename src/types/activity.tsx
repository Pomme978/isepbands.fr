// types/activity.ts
export interface ActivityUser {
  name: string;
  avatar: string;
  role?: string;
}

export interface ActivityType {
  id: string;
  type:
    | 'new_member'
    | 'post'
    | 'post_with_image'
    | 'new_group'
    | 'event'
    | 'announcement'
    | 'system_announcement';
  user?: ActivityUser; // Optional pour les messages système
  timestamp: Date;
  description: string;
  images?: string[]; // Array d'images pour les posts avec plusieurs images
  image?: string; // Rétrocompatibilité
  groupName?: string;
  eventTitle?: string;
  likes?: number;
  comments?: number;
  isSystemMessage?: boolean; // Indique si c'est un message automatique
}
