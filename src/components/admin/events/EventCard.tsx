'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Edit, Trash2, Users, Music } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Event {
  id: string;
  title: string;
  description?: string;
  eventType: 'JAM' | 'CONCERT' | 'RECORDING' | 'WORKSHOP' | 'MEETING' | 'OTHER';
  date: string;
  venue?: {
    id: string;
    name: string;
    address?: string;
  };
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  createdAt: string;
}

interface EventCardProps {
  event: Event;
}

const EVENT_TYPE_LABELS = {
  JAM: 'Jam Session',
  CONCERT: 'Concert',
  RECORDING: 'Enregistrement',
  WORKSHOP: 'Atelier',
  MEETING: 'Réunion',
  OTHER: 'Autre',
};

const EVENT_TYPE_COLORS = {
  JAM: 'bg-blue-50 text-blue-700 border-blue-200',
  CONCERT: 'bg-purple-50 text-purple-700 border-purple-200',
  RECORDING: 'bg-red-50 text-red-700 border-red-200',
  WORKSHOP: 'bg-green-50 text-green-700 border-green-200',
  MEETING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  OTHER: 'bg-gray-50 text-gray-700 border-gray-200',
};

const STATUS_COLORS = {
  DRAFT: 'bg-slate-50 text-slate-700 border-slate-200',
  PUBLISHED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
};

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const isToday = new Date().toDateString() === eventDate.toDateString();
  const isPast = eventDate < new Date();

  return (
    <Card
      className={`p-6 hover:shadow-md transition-shadow ${isToday ? 'ring-2 ring-yellow-400' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
            <Badge className={EVENT_TYPE_COLORS[event.eventType]}>
              {EVENT_TYPE_LABELS[event.eventType]}
            </Badge>
            <Badge className={STATUS_COLORS[event.status]}>
              {event.status === 'DRAFT'
                ? 'Brouillon'
                : event.status === 'PUBLISHED'
                  ? 'Publié'
                  : 'Annulé'}
            </Badge>
          </div>

          {event.description && <p className="text-gray-600 mb-3">{event.description}</p>}

          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {format(eventDate, 'EEEE dd MMMM yyyy à HH:mm', { locale: fr })}
                {isToday && (
                  <span className="ml-2 text-yellow-600 font-medium">• Aujourd&apos;hui</span>
                )}
                {isPast && <span className="ml-2 text-gray-400">• Passé</span>}
              </span>
            </div>

            {event.venue && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {event.venue.name}
                  {event.venue.address && ` - ${event.venue.address}`}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {/* Quick action buttons based on event type */}
          {event.eventType === 'JAM' && (
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              Membres
            </Button>
          )}

          {event.eventType === 'CONCERT' && (
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Music className="w-3 h-3" />
              Groupes
            </Button>
          )}

          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4" />
          </Button>

          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
