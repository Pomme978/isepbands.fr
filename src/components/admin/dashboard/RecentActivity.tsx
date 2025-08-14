'use client';

import ActivityItem from './ActivityItem';
import { CheckCircle, Clock, AlertTriangle, Music, LucideIcon } from 'lucide-react';

interface ActivityData {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'success' | 'info' | 'warning' | 'default';
  icon: LucideIcon;
}

// This could come from an API call or props in the future
const ACTIVITY_DATA: ActivityData[] = [
  {
    id: '1',
    title: 'New band registered',
    description: '"The Electric Vibes" just joined the platform',
    timestamp: '2 hours ago',
    type: 'success',
    icon: CheckCircle,
  },
  {
    id: '2',
    title: 'Event approved',
    description: '"Rock Night 2025" has been approved and published',
    timestamp: '4 hours ago',
    type: 'info',
    icon: Music,
  },
  {
    id: '3',
    title: 'Pending review',
    description: '3 bands are waiting for approval',
    timestamp: '6 hours ago',
    type: 'warning',
    icon: AlertTriangle,
  },
  {
    id: '4',
    title: 'Scheduled maintenance',
    description: 'Server maintenance scheduled for tonight at 2 AM',
    timestamp: '8 hours ago',
    type: 'info',
    icon: Clock,
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
          <h2 className="text-lg font-medium text-foreground">Recent Activity</h2>
          {activities.length > maxItems && (
            <button className="text-sm text-primary hover:text-primary/80 font-medium">
              View all
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
                return (
                  <ActivityItem
                    key={activity.id}
                    title={activity.title}
                    description={activity.description}
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
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
}
