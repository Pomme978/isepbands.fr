// @components/profile/EmptyState.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12 text-gray-500">
      <Icon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
      <p className="text-lg mb-2">{title}</p>
      <p className="text-sm mb-4">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="outline" className="shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          {action.label}
        </Button>
      )}
    </div>
  );
}
