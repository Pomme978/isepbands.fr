'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Music, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Loading from '@/components/ui/Loading';

interface Event {
  id: string;
  title: string;
  eventType: 'JAM' | 'CONCERT' | 'RECORDING' | 'WORKSHOP' | 'MEETING' | 'OTHER';
  date: string;
  attendeesCount?: number;
}

interface VenueEditEventsProps {
  venueId: string;
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

export default function VenueEditEvents({ venueId }: VenueEditEventsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [venueId]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Mock data for now
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Jam Session Hebdomadaire',
          eventType: 'JAM',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          attendeesCount: 12,
        },
        {
          id: '2',
          title: 'Concert de Noël',
          eventType: 'CONCERT',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          attendeesCount: 45,
        },
        {
          id: '3',
          title: 'Session d&apos;enregistrement - Album 2024',
          eventType: 'RECORDING',
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          attendeesCount: 8,
        },
        {
          id: '4',
          title: 'Atelier Guitare',
          eventType: 'WORKSHOP',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          attendeesCount: 15,
        },
      ];
      setEvents(mockEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <Loading text="Chargement des événements..." />;
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Rechercher un événement..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{events.length}</div>
          <div className="text-sm text-gray-600">Événements totaux</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-700">
            {events.filter((e) => e.eventType === 'JAM').length}
          </div>
          <div className="text-sm text-blue-600">Jam Sessions</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-700">
            {events.filter((e) => e.eventType === 'CONCERT').length}
          </div>
          <div className="text-sm text-purple-600">Concerts</div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {searchTerm ? 'Aucun événement trouvé' : 'Aucun événement dans ce lieu'}
            </p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <Badge className={EVENT_TYPE_COLORS[event.eventType]}>
                      {EVENT_TYPE_LABELS[event.eventType]}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(event.date)}</span>
                    </div>
                    {event.attendeesCount && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{event.attendeesCount} participants</span>
                      </div>
                    )}
                  </div>
                </div>

                <button className="text-primary hover:underline text-sm">
                  Voir l&apos;événement
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
