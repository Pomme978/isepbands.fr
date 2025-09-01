'use client';

import { LucideIcon } from 'lucide-react';

interface ActivityItemProps {
  title: string;
  description: string;
  timestamp: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  createdBy?: string;
}

// Simple markdown-like formatting
const formatText = (text: string) => {
  // Replace **text** with bold, ensuring no extra spaces
  return text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
};

export default function ActivityItem({
  title,
  description,
  timestamp,
  icon: Icon,
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/10',
  createdBy,
}: ActivityItemProps) {
  const formattedDescription = formatText(description);

  return (
    <div className="py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 ${iconBgColor} rounded-full flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between">
            <div className="flex-1 mr-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
              <div className="text-sm text-gray-700 leading-relaxed">
                <span dangerouslySetInnerHTML={{ __html: formattedDescription }} />
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xs text-gray-400 block">{timestamp}</span>
              {createdBy && (
                <span className="text-xs text-gray-500 block mt-0.5">Par {createdBy}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
