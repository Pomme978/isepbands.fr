// types/publicFeed.ts - Types for public feed only
export interface PublicFeedUser {
  name: string;
  avatar: string;
  role?: string;
}

export interface PublicFeedType {
  id: string;
  type: 'new_member' | 'post' | 'event' | 'announcement'; // NO system_announcement
  user: PublicFeedUser;
  timestamp: Date;
  title?: string;
  description: string;
  images?: string[];
  image?: string;
  groupName?: string;
  eventTitle?: string;
  likes?: number;
  comments?: number;
}