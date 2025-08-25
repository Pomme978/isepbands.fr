'use client';

import { ReactNode, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AdminExpandableSectionProps {
  title: string;
  count?: number;
  children: ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export default function AdminExpandableSection({
  title,
  count,
  children,
  defaultExpanded = true,
  className = ''
}: AdminExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
      >
        <h2 className="text-lg font-semibold text-gray-900">
          {title} {count !== undefined && `(${count})`}
        </h2>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-6">
          {children}
        </div>
      )}
    </div>
  );
}