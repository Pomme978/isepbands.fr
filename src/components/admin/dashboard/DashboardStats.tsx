'use client';

import StatCard from './StatCard';
import { Users, Megaphone, Calendar, Clock, LucideIcon } from 'lucide-react';
import { getCurrentAcademicYear } from '@/utils/schoolUtils';

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

// Realistic ISEP Bands stats for academic year
const STATS_DATA: StatData[] = [
  {
    title: `Membres ${getCurrentAcademicYear()}`,
    value: 42,
    icon: Users,
    iconBgColor: 'bg-blue-500',
    trend: {
      value: 8,
      isPositive: true,
    },
  },
  {
    title: 'Groupes actifs',
    value: 4,
    icon: Megaphone,
    iconBgColor: 'bg-green-500',
    trend: {
      value: 1,
      isPositive: true,
    },
  },
  {
    title: 'Événements cette année',
    value: 2,
    icon: Calendar,
    iconBgColor: 'bg-purple-500',
    trend: {
      value: 1,
      isPositive: true,
    },
  },
  {
    title: 'Jams organisées',
    value: 18,
    icon: Clock,
    iconBgColor: 'bg-orange-500',
    trend: {
      value: 6,
      isPositive: true,
    },
  },
];

interface DashboardStatsProps {
  stats?: StatData[];
  currentAcademicYear?: string;
}

export default function DashboardStats({
  stats = STATS_DATA,
  currentAcademicYear,
}: DashboardStatsProps) {
  // Update the members stat title if custom academic year is provided
  const updatedStats = currentAcademicYear
    ? stats.map((stat) =>
        stat.title.includes('Membres')
          ? { ...stat, title: `Membres ${currentAcademicYear}` }
          : stat,
      )
    : stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {updatedStats.map((stat, index) => (
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
