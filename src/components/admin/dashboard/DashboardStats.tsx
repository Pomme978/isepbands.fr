'use client';

import StatCard from './StatCard';
import { Users, Megaphone, Calendar, Ticket, LucideIcon } from 'lucide-react';

interface StatData {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// This could come from an API call or props in the future
const STATS_DATA: StatData[] = [
  {
    title: 'Total Users',
    value: 1234,
    icon: Users,
    iconBgColor: 'bg-blue-500',
    trend: {
      value: 12,
      isPositive: true,
    },
  },
  {
    title: 'Active Bands',
    value: 58,
    icon: Megaphone,
    iconBgColor: 'bg-green-500',
    trend: {
      value: 8,
      isPositive: true,
    },
  },
  {
    title: 'Upcoming Events',
    value: 12,
    icon: Calendar,
    iconBgColor: 'bg-purple-500',
    trend: {
      value: 4,
      isPositive: true,
    },
  },
  {
    title: 'Tickets Sold',
    value: 8942,
    icon: Ticket,
    iconBgColor: 'bg-yellow-500',
    trend: {
      value: 23,
      isPositive: true,
    },
  },
];

interface DashboardStatsProps {
  stats?: StatData[];
}

export default function DashboardStats({ stats = STATS_DATA }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={`${stat.title}-${index}`}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconBgColor={stat.iconBgColor}
          trend={stat.trend}
        />
      ))}
    </div>
  );
}
