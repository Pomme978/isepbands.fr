'use client';

import { ReactNode } from 'react';
import { ArrowLeft, LucideIcon } from 'lucide-react';
import LangLink from '@/components/common/LangLink';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: LucideIcon;
  backTo?: string;
  backLabel?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export default function AdminPageHeader({
  title,
  subtitle,
  description,
  icon: Icon,
  backTo,
  backLabel = 'Back',
  actions,
  children,
  className = '',
}: AdminPageHeaderProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
          {backTo && (
            <LangLink
              href={backTo}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">{backLabel}</span>
            </LangLink>
          )}

          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            {Icon && <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />}
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{title}</h1>
              {(subtitle || description) && (
                <p className="text-sm sm:text-base text-gray-600 mt-1 line-clamp-2">
                  {subtitle || description}
                </p>
              )}
            </div>
          </div>
        </div>

        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>

      {children}
    </div>
  );
}
