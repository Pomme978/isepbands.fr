'use client';

import { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { Users, UsersRound, Calendar, LucideIcon } from 'lucide-react';
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

// Fetch real stats from API
const fetchStats = async (): Promise<StatData[]> => {
  try {
    // Fetch total members count
    const membersResponse = await fetch('/api/admin/stats/members');
    const membersData = await membersResponse.json();
    const totalMembers = membersData.success ? membersData.count : 0;

    // Fetch pending users count
    const pendingResponse = await fetch('/api/admin/stats/pending');
    const pendingData = await pendingResponse.json();
    const pendingUsers = pendingData.success ? pendingData.count : 0;

    return [
      {
        title: `Membres ${getCurrentAcademicYear()}`,
        value: totalMembers,
        icon: Users,
        iconBgColor: 'bg-blue-500',
      },
      {
        title: 'Groupes actifs',
        value: 0, // Will be implemented later
        icon: UsersRound,
        iconBgColor: 'bg-orange-500',
      },
      {
        title: 'Événements cette année',
        value: 0, // Will be implemented later
        icon: Calendar,
        iconBgColor: 'bg-purple-500',
      },
    ];
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return default stats on error
    return [
      {
        title: `Membres ${getCurrentAcademicYear()}`,
        value: 0,
        icon: Users,
        iconBgColor: 'bg-blue-500',
      },
      {
        title: 'Groupes actifs',
        value: 0,
        icon: UsersRound,
        iconBgColor: 'bg-orange-500',
      },
      {
        title: 'Événements cette année',
        value: 0,
        icon: Calendar,
        iconBgColor: 'bg-purple-500',
      },
    ];
  }
};

interface DashboardStatsProps {
  stats?: StatData[];
  currentAcademicYear?: string;
}

export default function DashboardStats({ currentAcademicYear }: DashboardStatsProps) {
  const [stats, setStats] = useState<StatData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const statsData = await fetchStats();
        // Update the members stat title if custom academic year is provided
        const updatedStats = currentAcademicYear
          ? statsData.map((stat) =>
              stat.title.includes('Membres')
                ? { ...stat, title: `Membres ${currentAcademicYear}` }
                : stat,
            )
          : statsData;
        setStats(updatedStats);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [currentAcademicYear]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-3 sm:flex sm:gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 animate-pulse sm:w-auto">
            <div className="flex items-center justify-center space-x-3">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-8"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:flex sm:gap-6">
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
