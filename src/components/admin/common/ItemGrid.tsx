'use client';

import { ReactNode } from 'react';

interface ItemGridProps {
  children: ReactNode;
  loading?: boolean;
  emptyIcon?: ReactNode;
  emptyMessage?: string;
  loadingItemsCount?: number;
  className?: string;
}

export default function ItemGrid({
  children,
  loading = false,
  emptyIcon,
  emptyMessage = "Aucun élément trouvé",
  loadingItemsCount = 12,
  className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4"
}: ItemGridProps) {
  if (loading) {
    return (
      <div className={className}>
        {Array.from({ length: loadingItemsCount }, (_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="h-48 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-4"></div>
            <div className="flex justify-between">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const hasChildren = Array.isArray(children) ? children.length > 0 : children;

  if (!hasChildren) {
    return (
      <div className="text-center py-12">
        {emptyIcon}
        <p className="text-gray-600 font-ubuntu mt-4">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {children}
    </div>
  );
}