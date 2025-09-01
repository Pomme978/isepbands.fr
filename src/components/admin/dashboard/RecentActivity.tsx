'use client';

import { useState, useEffect } from 'react';
import ActivityItem from './ActivityItem';
import {
  CheckCircle,
  UserCheck,
  UserX,
  Megaphone,
  Calendar,
  Music,
  AlertTriangle,
  Settings,
  LucideIcon,
  Crown,
  Activity,
  MessageSquare,
  Shield,
  Archive,
} from 'lucide-react';
import Loading from '@/components/ui/Loading';

interface ApiActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  userName?: string;
  userRole?: string;
  createdAt: string;
  createdByName?: string;
  createdByRole?: string;
}

interface ActivityData {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'success' | 'info' | 'warning' | 'error' | 'default';
  icon: LucideIcon;
  adminAction?: {
    adminName: string;
    adminRole?: string;
  };
}

// Transform API activity to internal format
const transformApiActivity = (apiActivity: ApiActivity): ActivityData => {
  const getIconAndType = (type: string) => {
    switch (type) {
      case 'new_member':
      case 'user_created':
        return { icon: UserCheck, type: 'success' as const };
      case 'user_archived':
        return { icon: Archive, type: 'warning' as const };
      case 'user_restored':
        return { icon: UserCheck, type: 'success' as const };
      case 'role_created':
      case 'permission_created':
        return { icon: Shield, type: 'info' as const };
      case 'system_settings_updated':
      case 'year_migration':
        return { icon: Settings, type: 'info' as const };
      case 'post':
      case 'custom':
        return { icon: MessageSquare, type: 'info' as const };
      case 'system_announcement':
        return { icon: Activity, type: 'info' as const };
      case 'event':
        return { icon: Calendar, type: 'info' as const };
      default:
        return { icon: Settings, type: 'default' as const };
    }
  };

  const { icon, type } = getIconAndType(apiActivity.type);
  
  return {
    id: apiActivity.id,
    title: apiActivity.title,
    description: apiActivity.description,
    timestamp: new Date(apiActivity.createdAt).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    }),
    type,
    icon,
    adminAction: apiActivity.createdByName ? {
      adminName: apiActivity.createdByName,
      adminRole: apiActivity.createdByRole,
    } : undefined,
  };
};

// Mock data with proper admin tracking (used as fallback)
const ACTIVITY_DATA: ActivityData[] = [
  {
    id: '1',
    title: 'Utilisateur approuvé',
    description: 'Alice Martin (A2) a été approuvée et peut maintenant accéder à la plateforme',
    timestamp: 'il y a 2 heures',
    type: 'success',
    icon: UserCheck,
    adminAction: {
      adminName: 'Maxime LE ROY MEUNIER',
      adminRole: 'Président',
    },
  },
  {
    id: '2',
    title: 'Groupe créé',
    description: 'Le groupe "Electric Dreams" a été créé par Paul Durand avec 3 membres',
    timestamp: 'il y a 3 heures',
    type: 'info',
    icon: Megaphone,
    adminAction: {
      adminName: 'Sarah LEVY',
      adminRole: 'Vice-présidente',
    },
  },
  {
    id: '3',
    title: 'Événement publié',
    description:
      '"Concert de mi-année 2025" a été publié et est maintenant visible par tous les membres',
    timestamp: 'il y a 4 heures',
    type: 'info',
    icon: Calendar,
    adminAction: {
      adminName: 'Armand OCTEAU',
      adminRole: 'Vice-président',
    },
  },
  {
    id: '4',
    title: 'Demande refusée',
    description: "L'inscription de Jean Dupont a été refusée (profil incomplet)",
    timestamp: 'il y a 5 heures',
    type: 'error',
    icon: UserX,
    adminAction: {
      adminName: 'Maéva RONCEY',
      adminRole: 'Secrétaire générale',
    },
  },
  {
    id: '5',
    title: 'Groupe approuvé',
    description: '"Midnight Sessions" (Jazz Fusion) a été approuvé avec 4 membres',
    timestamp: 'il y a 6 heures',
    type: 'success',
    icon: Music,
    adminAction: {
      adminName: 'Shane PRADDER',
      adminRole: 'Trésorier',
    },
  },
  {
    id: '6',
    title: 'Paramètres modifiés',
    description:
      "Les paramètres de l'association ont été mis à jour (nouveaux instruments disponibles)",
    timestamp: 'il y a 8 heures',
    type: 'info',
    icon: Settings,
    adminAction: {
      adminName: 'Maxime LE ROY MEUNIER',
      adminRole: 'Président',
    },
  },
  {
    id: '7',
    title: 'Approbations en attente',
    description: '5 nouveaux utilisateurs et 2 groupes attendent une validation',
    timestamp: 'il y a 12 heures',
    type: 'warning',
    icon: AlertTriangle,
  },
  {
    id: '8',
    title: 'Jam session planifiée',
    description: 'Nouvelle jam session programmée pour samedi 14h-18h en salle de répétition',
    timestamp: 'il y a 1 jour',
    type: 'info',
    icon: Music,
    adminAction: {
      adminName: 'Sarah LEVY',
      adminRole: 'Vice-présidente',
    },
  },
];

const getActivityColors = (type: ActivityData['type']) => {
  switch (type) {
    case 'success':
      return {
        iconColor: 'text-green-600',
        iconBgColor: 'bg-green-100',
      };
    case 'info':
      return {
        iconColor: 'text-blue-600',
        iconBgColor: 'bg-blue-100',
      };
    case 'warning':
      return {
        iconColor: 'text-yellow-600',
        iconBgColor: 'bg-yellow-100',
      };
    case 'error':
      return {
        iconColor: 'text-red-600',
        iconBgColor: 'bg-red-100',
      };
    default:
      return {
        iconColor: 'text-primary',
        iconBgColor: 'bg-primary/10',
      };
  }
};

interface RecentActivityProps {
  activities?: ActivityData[];
  maxItems?: number;
}

export default function RecentActivity({
  activities: propActivities = [],
  maxItems = 10,
}: RecentActivityProps) {
  const [activities, setActivities] = useState<ActivityData[]>(propActivities);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/clubfeed');
        if (response.ok) {
          const data = await response.json();
          const transformedActivities = data.activities.map(transformApiActivity);
          setActivities(transformedActivities);
        } else {
          // Use fallback data if API fails
          setActivities(ACTIVITY_DATA.slice(0, 3)); // Show only first 3 mock items
        }
      } catch (error) {
        console.error('Failed to fetch admin activities:', error);
        // Use fallback data
        setActivities(ACTIVITY_DATA.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div className="bg-card rounded-lg shadow border">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Activité récente</h2>
          {activities.length > maxItems && (
            <button className="text-sm text-primary hover:text-primary/80 font-medium">
              Voir tout
            </button>
          )}
        </div>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {/* Skeleton pour 3 activités */}
            {[1, 2, 3].map((index) => (
              <div key={index} className="py-4 border-b border-gray-200 last:border-b-0 animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="h-4 bg-gray-300 rounded w-32"></div>
                      <div className="text-right ml-3 flex-shrink-0 space-y-1">
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : displayedActivities.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {displayedActivities.map((activity) => {
                const colors = getActivityColors(activity.type);

                // Extract creator info for separate display
                const createdBy = activity.adminAction 
                  ? `${activity.adminAction.adminName}${activity.adminAction.adminRole ? ` (${activity.adminAction.adminRole})` : ''}`
                  : 'Système';

                return (
                  <ActivityItem
                    key={activity.id}
                    title={activity.title}
                    description={activity.description}
                    timestamp={activity.timestamp}
                    icon={activity.icon}
                    iconColor={colors.iconColor}
                    iconBgColor={colors.iconBgColor}
                    createdBy={createdBy}
                  />
                );
              })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">Aucune activité pour le moment</p>
            <p className="text-sm text-gray-500">
              Les actions administratives apparaîtront ici
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
