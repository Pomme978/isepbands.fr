'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
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
}: StatCardProps) {
  // Extract the color from iconBgColor for background
  const getColorFromBgClass = (bgClass: string) => {
    if (bgClass.includes('blue')) return 'bg-blue-500 border-white';
    if (bgClass.includes('green')) return 'bg-green-500 border-white';
    if (bgClass.includes('orange')) return 'bg-orange-500 border-white';
    if (bgClass.includes('purple')) return 'bg-purple-500 border-white';
    if (bgClass.includes('red')) return 'bg-red-500 border-white';
    if (bgClass.includes('yellow')) return 'bg-yellow-500 border-white';
    return 'bg-primary border-white';
  };

  return (
    <div
      className={`rounded-lg shadow p-4 border border-white sm:w-auto sm:min-w-[200px] ${getColorFromBgClass(iconBgColor)}`}
    >
      <div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-2 sm:space-y-0">
        <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col items-center sm:items-start">
          <span className="text-sm text-white/80 text-center sm:text-left sm:order-first">
            {title}
          </span>
          <span className="text-2xl font-bold text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
        </div>
      </div>
    </div>
  );
}
