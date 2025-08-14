'use client';

import { ReactNode } from 'react';

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function SidebarSection({ title, children, className = '' }: SidebarSectionProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
