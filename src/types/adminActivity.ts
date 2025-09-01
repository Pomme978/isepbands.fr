// types/adminActivity.ts - Types for admin activities only
export interface AdminActivityUser {
  name: string;
  avatar: string;
  role?: string;
}

// Types standardisés pour les logs admin
export type AdminActivityLogType = 
  // Gestion des utilisateurs
  | 'user_created'
  | 'user_updated' 
  | 'user_deleted'
  | 'user_approved'
  | 'user_rejected' 
  | 'user_archived'
  | 'user_restored'
  | 'user_password_reset'
  // Gestion des rôles et permissions
  | 'role_created'
  | 'role_updated'
  | 'role_deleted'
  | 'role_colors_updated'
  | 'permission_created'
  | 'permission_updated'
  | 'permission_deleted'
  // Gestion des lieux
  | 'venue_created'
  | 'venue_updated'
  | 'venue_archived'
  | 'venue_restored'
  // Système et paramètres
  | 'system_settings_updated'
  | 'year_migration'
  | 'system_announcement'
  // Gestion des badges
  | 'badge_created'
  | 'badge_updated'
  | 'badge_deleted'
  // Gestion du contenu
  | 'social_link_created'
  | 'social_link_updated'
  | 'social_link_deleted'
  | 'team_photo_updated'
  | 'team_settings_updated'
  // Legacy/autres
  | 'custom'
  | 'post'
  | 'event'
  | 'announcement';

export interface AdminActivityType {
  id: string;
  type: AdminActivityLogType;
  user?: AdminActivityUser;
  timestamp: Date;
  title?: string;
  description: string;
  images?: string[];
  image?: string;
  groupName?: string;
  eventTitle?: string;
  likes?: number;
  comments?: number;
  isSystemMessage?: boolean;
  createdBy?: string;
  isArchived?: boolean;
  archivedAt?: Date;
  archivedBy?: string;
  archiveReason?: string;
}