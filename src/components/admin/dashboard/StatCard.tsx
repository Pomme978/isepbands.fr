'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  invertColors?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-white',
  iconBgColor = 'bg-primary',
  invertColors = false,
}: StatCardProps) {
  // Determine background class based on iconBgColor
  const getBgClass = () => {
    if (!invertColors) return 'bg-card';

    if (iconBgColor === 'bg-blue-500') return 'bg-blue-500';
    if (iconBgColor === 'bg-orange-500') return 'bg-orange-500';
    if (iconBgColor === 'bg-purple-500') return 'bg-purple-500';
    if (iconBgColor === 'bg-green-500') return 'bg-green-500';

    return iconBgColor;
  };

  return (
    <div className={`rounded-lg shadow p-3 md:p-4 border ${getBgClass()} md:w-56`}>
      <div className="flex flex-col items-center text-center md:flex-col md:items-start md:text-left">
        <div className="flex-shrink-0 mb-2">
          <Icon className={`w-6 h-6 md:w-6 md:h-6 ${invertColors ? 'text-white' : iconColor}`} />
        </div>
        <div className="w-full">
          <dl>
            <dt
              className={`hidden md:block text-xs font-medium ${invertColors ? 'text-white/80' : 'text-muted-foreground'}`}
            >
              {title}
            </dt>
            <dd
              className={`text-2xl md:text-3xl font-bold ${invertColors ? 'text-white' : 'text-foreground'}`}
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
