'use client';

import { ReactNode } from 'react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export default function AdminPageHeader({
  title,
  description,
  actions,
  className = '',
}: AdminPageHeaderProps) {
  return (
    <div
      className={`flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 ${className}`}
    >
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl md:text-xl font-bold text-gray-900 break-words">{title}</h1>
        {description && <p className="text-base md:text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center space-x-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}
