'use client';

import LangLink from '@/components/common/LangLink';
import { Calendar, MapPin, Settings, Music, Clock, Ticket, LucideIcon } from 'lucide-react';

type EventType = 'concert' | 'jam' | 'rehearsal' | 'showcase' | 'vente' | 'autre';

interface UpcomingEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  venue: string;
}

interface UpcomingEventCardProps {
  event?: UpcomingEvent | null;
}

const eventTypeConfig: Record<EventType, { label: string; icon: LucideIcon }> = {
  concert: { label: 'Concert', icon: Music },
  jam: { label: 'Jam', icon: Music },
  rehearsal: { label: 'Répétition', icon: Clock },
  showcase: { label: 'Showcase', icon: Music },
  vente: { label: 'Vente', icon: Ticket },
  autre: { label: 'Autre', icon: Calendar },
};

// Mock data
const MOCK_EVENT: UpcomingEvent = {
  id: 'event_123',
  title: 'Concert de Mi-Année 2025',
  type: 'concert',
  date: '2025-01-18',
  venue: 'Amphithéâtre ISEP',
};

export default function UpcomingEventCard({ event = MOCK_EVENT }: UpcomingEventCardProps) {
  if (!event) {
    return (
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-4 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 opacity-80" />
          <span className="font-medium">Aucun événement prévu</span>
        </div>
        <LangLink
          href="/admin/events/new"
          className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded text-sm font-medium transition-colors"
        >
          Créer
        </LangLink>
      </div>
    );
  }

  const eventConfig = eventTypeConfig[event.type];
  const EventIcon = eventConfig.icon;
  const eventDate = new Date(event.date);

  return (
    <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-4 flex items-center justify-between text-white">
      {/* Left side - Event info */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <EventIcon className="w-5 h-5" />
          <h2 className="font-bold">Prochain Event: </h2>
          <span className="font-semibold">{event.title}</span>
        </div>

        <div className="flex items-center space-x-3 text-sm opacity-90">
          <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-medium">
            {eventConfig.label}
          </span>
          <span>{eventDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
          <div className="flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{event.venue}</span>
          </div>
        </div>
      </div>

      {/* Right side - Action button */}
      <LangLink
        href={`/admin/events/${event.id}`}
        className="flex items-center space-x-1.5 px-3 py-1.5 bg-white text-primary rounded hover:bg-white/90 transition-colors font-medium text-sm"
      >
        <Settings className="w-4 h-4" />
        <span>Gérer</span>
      </LangLink>
    </div>
  );
}
