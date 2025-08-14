'use client';

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
} from 'lucide-react';

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

// Mock data with proper admin tracking
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
  activities = ACTIVITY_DATA,
  maxItems = 10,
}: RecentActivityProps) {
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
        {displayedActivities.length > 0 ? (
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-border">
              {displayedActivities.map((activity) => {
                const colors = getActivityColors(activity.type);

                // Enhanced description with admin info
                const enhancedDescription = activity.adminAction
                  ? `${activity.description} • Par ${activity.adminAction.adminName}${activity.adminAction.adminRole ? ` (${activity.adminAction.adminRole})` : ''}`
                  : activity.description;

                return (
                  <ActivityItem
                    key={activity.id}
                    title={activity.title}
                    description={enhancedDescription}
                    timestamp={activity.timestamp}
                    icon={activity.icon}
                    iconColor={colors.iconColor}
                    iconBgColor={colors.iconBgColor}
                  />
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucune activité récente</p>
          </div>
        )}
      </div>
    </div>
  );
}
