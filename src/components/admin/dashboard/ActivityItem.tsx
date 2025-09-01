'use client';

import { LucideIcon } from 'lucide-react';

interface ActivityItemProps {
  title: string;
  description: string;
  timestamp: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

// Simple markdown-like formatting
const formatText = (text: string) => {
  // Replace **text** with bold
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

export default function ActivityItem({
  title,
  description,
  timestamp,
  icon: Icon,
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/10',
}: ActivityItemProps) {
  // Check if description is long (more than 150 chars)
  const isLongPost = description.length > 150;
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
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{timestamp}</span>
          </div>
          <div className={`text-sm text-gray-700 leading-relaxed ${isLongPost ? 'max-w-none' : ''}`}>
            {isLongPost ? (
              <div className="space-y-2">
                {formattedDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-sm" dangerouslySetInnerHTML={{ __html: formatText(paragraph) }} />
                ))}
              </div>
            ) : (
              <span dangerouslySetInnerHTML={{ __html: formattedDescription }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
