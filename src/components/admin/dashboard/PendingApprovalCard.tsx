'use client';

import { Clock, Eye, LucideIcon } from 'lucide-react';
import Avatar from '@/components/common/Avatar';

interface PendingItem {
  id: string;
  name: string;
  type: 'user' | 'band';
  email?: string;
  genre?: string;
  submittedAt: string;
  avatar?: string;
}

interface PendingApprovalCardProps {
  title: string;
  items: PendingItem[];
  onViewDetails: (item: PendingItem) => void;
  emptyMessage?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export default function PendingApprovalCard({
  title,
  items,
  onViewDetails,
  emptyMessage = 'No pending approvals',
  icon: Icon,
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/10',
}: PendingApprovalCardProps) {
  return (
    <div className="bg-card rounded-lg shadow border">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 ${iconBgColor} rounded-md flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">
              {items.length} item{items.length !== 1 ? 's' : ''} pending approval
            </p>
          </div>
          {items.length > 0 && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              <span>Review required</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Avatar src={item.avatar} name={item.name} alt={item.name} size="md" />
                  <div>
                    <h4 className="font-medium text-foreground">{item.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      {item.type === 'user' && item.email && <span>{item.email}</span>}
                      {item.type === 'band' && item.genre && <span>{item.genre}</span>}
                      <span>•</span>
                      <span>{item.submittedAt}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onViewDetails(item)}
                  className="flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Review
                </button>
              </div>
            ))}

            {items.length > 5 && (
              <button className="w-full text-center py-3 text-sm text-primary hover:text-primary/80 font-medium bg-accent/20 hover:bg-accent/40 rounded-lg transition-colors">
                View all pending ({items.length})
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
