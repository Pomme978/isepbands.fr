'use client';

import { useState, useEffect } from 'react';
import { Calendar, AlertCircle, RotateCcw, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';

interface ArchivedEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  venue?: string;
  attendeeCount: number;
  archivedAt: string;
  archivedBy: string;
  reason?: string;
  status: 'PAST' | 'CANCELLED' | 'DELETED';
}

interface ArchivedEventsProps {
  filters: {
    search: string;
    sortBy: string;
    dateRange: string;
  };
}

export default function ArchivedEvents({ filters }: ArchivedEventsProps) {
  const [events, setEvents] = useState<ArchivedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArchivedEvents();
  }, [filters]);

  const fetchArchivedEvents = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // Mock data for now
      setEvents([
        {
          id: '1',
          title: "Concert de fin d'année 2023",
          description: "Grand concert de fin d'année avec tous les groupes",
          date: '2023-12-15',
          venue: 'Amphithéâtre ISEP',
          attendeeCount: 150,
          archivedAt: '2024-01-10',
          archivedBy: 'System',
          reason: 'Événement terminé automatiquement archivé',
          status: 'PAST',
        },
        {
          id: '2',
          title: 'Jam Session Mars',
          description: "Session d'improvisation ouverte",
          date: '2024-03-20',
          venue: 'Studio ISEP',
          attendeeCount: 0,
          archivedAt: '2024-03-18',
          archivedBy: 'Admin',
          reason: 'Événement annulé par manque de participants',
          status: 'CANCELLED',
        },
      ]);
    } catch (err) {
      setError('Erreur lors du chargement des événements archivés');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreEvent = async (eventId: string) => {
    try {
      console.log('Restoring event:', eventId);
      fetchArchivedEvents();
    } catch (err) {
      console.error('Error restoring event:', err);
    }
  };

  const getStatusColor = (status: ArchivedEvent['status']) => {
    switch (status) {
      case 'PAST':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'DELETED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: ArchivedEvent['status']) => {
    switch (status) {
      case 'PAST':
        return 'Terminé';
      case 'CANCELLED':
        return 'Annulé';
      case 'DELETED':
        return 'Supprimé';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <Loading text="Chargement des événements archivés..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
        <span className="text-red-600">{error}</span>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun événement archivé</h3>
        <p className="text-gray-600">
          {filters.search ? 'Aucun résultat pour cette recherche.' : 'Aucun événement archivé.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {events.length} événement{events.length > 1 ? 's' : ''} archivé
          {events.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}
                    >
                      {getStatusLabel(event.status)}
                    </span>
                  </div>
                  {event.description && (
                    <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                  )}

                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Date: {new Date(event.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {event.venue && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{event.venue}</span>
                      </div>
                    )}
                    <span>
                      {event.attendeeCount} participant{event.attendeeCount > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                    <span>Archivé le {new Date(event.archivedAt).toLocaleDateString('fr-FR')}</span>
                    <span>Par {event.archivedBy}</span>
                  </div>

                  {event.reason && (
                    <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      <strong>Raison:</strong> {event.reason}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRestoreEvent(event.id)}
                  className="flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Restaurer
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
