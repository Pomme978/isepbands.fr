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
  RefreshCw,
} from 'lucide-react';
import Loading from '@/components/ui/Loading';
import AdminActivitiesModal from './AdminActivitiesModal';

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
  metadata?: Record<string, unknown>;
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
      case 'database_integrity_check':
        return { icon: Settings, type: 'info' as const };
      case 'root_login':
        return { icon: Shield, type: 'warning' as const };
      case 'first_login':
        return { icon: UserCheck, type: 'success' as const };
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
    metadata: apiActivity.metadata as Record<string, unknown>,
    adminAction: apiActivity.createdByName ? {
      adminName: apiActivity.createdByName,
      adminRole: apiActivity.createdByRole,
    } : undefined,
  };
};


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
  maxItems = 5, // Changed to 5 by default
}: RecentActivityProps) {
  const [activities, setActivities] = useState<ActivityData[]>(propActivities);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);

  const fetchActivities = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const response = await fetch('/api/admin/clubfeed');
      if (response.ok) {
        const data = await response.json();
        const transformedActivities = data.activities.map(transformApiActivity);
        setActivities(transformedActivities);
      } else {
        // API failed
        console.error('API /admin/clubfeed failed with status:', response.status);
        setActivities([]);
      }
    } catch (error) {
      console.error('Failed to fetch admin activities:', error);
      setActivities([]);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const displayedActivities = activities.slice(0, maxItems);

  if (loading) {
    return (
      <div className="bg-card rounded-lg">
        <div className="px-6 py-4 border-b border-border animate-pulse">
          <div className="flex items-center">
            <div className="h-6 bg-gray-200 rounded w-32 flex-1"></div>
            <div className="flex items-center gap-3">
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
        <div className="p-6">
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
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow border">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center">
          <h2 className="text-lg font-medium text-foreground flex-1">Activité récente</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchActivities(true)}
              disabled={refreshing}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-400 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Actualisation...' : 'Actualiser'}
            </button>
            {activities.length > maxItems && (
              <button 
                onClick={() => setShowAllModal(true)}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Voir tout ({activities.length - maxItems} autres)
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        {displayedActivities.length > 0 ? (
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
                    metadata={activity.metadata}
                    isExpanded={expandedId === activity.id}
                    onToggleExpand={() => setExpandedId(expandedId === activity.id ? null : activity.id)}
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

      {/* Modal for all activities */}
      <AdminActivitiesModal 
        isOpen={showAllModal}
        onClose={() => setShowAllModal(false)}
        activities={activities}
      />
    </div>
  );
}
