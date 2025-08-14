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
  trend,
}: StatCardProps) {
  return (
    <div className="bg-card rounded-lg shadow p-6 border">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 ${iconBgColor} rounded-md flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-muted-foreground truncate">{title}</dt>
            <dd className="text-lg font-medium text-foreground">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </dd>
          </dl>
        </div>
      </div>

      {trend && (
        <div className="mt-4">
          <div
            className={`flex items-center text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            <span className="font-medium">
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </span>
            <span className="ml-1 text-muted-foreground">vs last month</span>
          </div>
        </div>
      )}
    </div>
  );
}
