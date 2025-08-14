// @components/profile/EventBanner.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Clock, Users, Calendar as CalendarIcon } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  nextEvent?: {
    type: 'concert' | 'rehearsal' | 'jam';
    date: string;
    venue?: string;
  };
}

interface EventBannerProps {
  groups: Group[];
  locale: string;
  onEventClick: (eventId: string) => void;
}

const getEventTypeDisplay = (type: string) => {
  const types = {
    concert: { label: 'Concert', color: 'bg-red-100 text-red-800', icon: Music },
    rehearsal: { label: 'Répétition', color: 'bg-blue-100 text-blue-800', icon: Clock },
    jam: { label: 'Jam Session', color: 'bg-green-100 text-green-800', icon: Users },
  };
  return (
    types[type as keyof typeof types] || {
      label: type,
      color: 'bg-gray-100 text-gray-800',
      icon: CalendarIcon,
    }
  );
};

export default function EventBanner({ groups, onEventClick }: EventBannerProps) {
  const activeGroups = groups.filter((group) => group.nextEvent);

  if (activeGroups.length === 0) {
    return null;
  }

  const nextEvent = activeGroups[0].nextEvent!;
  const group = activeGroups[0];
  const eventType = getEventTypeDisplay(nextEvent.type);

  return (
    <Card className="p-6 bg-gradient-to-r from-secondary to-primary text-white border-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-full">
            <Music className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">
              {eventType.label} le {nextEvent.date}
            </h3>
            <p className="text-white/90">
              avec <strong>{group.name}</strong>
              {nextEvent.venue && ` à ${nextEvent.venue}`}
            </p>
          </div>
        </div>
        <Button
          variant="secondary"
          className="bg-white text-primary hover:bg-gray-200 ease-in-out shadow-lg font-semibold"
          onClick={() => onEventClick('placeholder-event-id')}
        >
          Voir l&apos;événement
        </Button>
      </div>
    </Card>
  );
}
