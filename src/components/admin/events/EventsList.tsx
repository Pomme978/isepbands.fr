'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminExpandableSection from '../common/AdminExpandableSection';
import EventCard from './EventCard';
import Loading from '@/components/ui/Loading';

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

interface EventsListProps {
  filters: {
    search: string;
    eventType: string;
    dateSort: string;
    status: string;
  };
  refreshTrigger?: number;
}

export default function EventsList({ filters, refreshTrigger }: EventsListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Mock data for now since we don't have the API yet
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Jam Session Hebdomadaire',
          description: 'Session ouverte à tous les niveaux',
          eventType: 'JAM',
          date: new Date().toISOString(),
          status: 'PUBLISHED',
          createdAt: new Date().toISOString(),
          venue: {
            id: '1',
            name: 'NDC - Salle de musique',
            address: 'Campus NDC',
          },
        },
        {
          id: '2',
          title: "Concert de fin d'année",
          description: 'Grand concert avec tous les groupes',
          eventType: 'CONCERT',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'PUBLISHED',
          createdAt: new Date().toISOString(),
          venue: {
            id: '2',
            name: 'Salle de concert Neuilly',
            address: 'Neuilly-sur-Seine',
          },
        },
        {
          id: '3',
          title: "Session d'enregistrement - Album 2024",
          description: 'Enregistrement du nouvel album du club',
          eventType: 'RECORDING',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'PUBLISHED',
          createdAt: new Date().toISOString(),
        },
      ];

      // Apply filters
      let filteredEvents = mockEvents;

      // Search filter
      if (filters.search) {
        filteredEvents = filteredEvents.filter(
          (event) =>
            event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            event.description?.toLowerCase().includes(filters.search.toLowerCase()),
        );
      }

      // Event type filter
      if (filters.eventType !== 'all') {
        filteredEvents = filteredEvents.filter((event) => event.eventType === filters.eventType);
      }

      // Sort by date
      filteredEvents.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return filters.dateSort === 'newest' ? dateB - dateA : dateA - dateB;
      });

      setEvents(filteredEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, refreshTrigger]);

  if (loading) {
    return (
      <div className="py-12">
        <Loading text="Chargement des événements..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Erreur lors du chargement</div>
        <div className="text-gray-500 mb-4">{error}</div>
        <button
          onClick={fetchEvents}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Separate events by status
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    return eventDay.getTime() === today.getTime();
  });

  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    return eventDay.getTime() >= tomorrow.getTime();
  });

  const pastEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    return eventDay.getTime() < today.getTime();
  });

  return (
    <div className="space-y-6">
      {/* Today's Events - Always shown at top if they exist */}
      {todayEvents.length > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center gap-2">
            Événements d&apos;aujourd&apos;hui
          </h3>
          <div className="space-y-4">
            {todayEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <AdminExpandableSection
          title="Événements à venir"
          count={upcomingEvents.length}
          defaultExpanded={true}
        >
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </AdminExpandableSection>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <AdminExpandableSection
          title="Événements passés"
          count={pastEvents.length}
          defaultExpanded={false}
        >
          <div className="space-y-4">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </AdminExpandableSection>
      )}

      {/* No events found */}
      {events.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">Aucun événement trouvé</div>
          <p className="text-sm text-gray-400">
            Essayez de modifier vos filtres ou créez un nouvel événement
          </p>
        </div>
      )}
    </div>
  );
}
