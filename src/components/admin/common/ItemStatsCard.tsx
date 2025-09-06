'use client';

import { ReactNode } from 'react';

interface StatItem {
  label: string;
  value: string | number;
}

interface ItemStatsCardProps {
  title: string;
  subtitle?: string;
  mainStat: {
    value: string | number;
    label: string;
  };
  stats: StatItem[];
  additionalInfo?: ReactNode;
  className?: string;
}

export default function ItemStatsCard({
  title,
  subtitle,
  mainStat,
  stats,
  additionalInfo,
  className = "bg-white rounded-lg border border-gray-200 p-4"
}: ItemStatsCardProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold font-outfit text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-gray-600 font-ubuntu">
              {subtitle}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold font-outfit text-primary">{mainStat.value}</p>
          <p className="text-xs text-gray-600 font-ubuntu">{mainStat.label}</p>
        </div>
      </div>

      <div className={`grid grid-cols-${stats.length} gap-3 mb-3`}>
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-2 text-center">
            <p className="text-lg font-bold font-outfit text-primary mb-1">
              {stat.value}
            </p>
            <p className="text-xs text-gray-600 font-ubuntu">{stat.label}</p>
          </div>
        ))}
      </div>

      {additionalInfo && additionalInfo}
    </div>
  );
}