'use client';

import { useState, useEffect } from 'react';
import { MapPin, Calendar, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';

interface ArchivedVenue {
  id: string;
  name: string;
  address?: string;
  city?: string;
  type?: string;
  photoUrl?: string;
  archivedAt?: string;
  archivedBy?: string;
}

interface ArchivedVenuesProps {
  filters: {
    search: string;
    sortBy: string;
    dateRange: string;
  };
}

export default function ArchivedVenues({ filters }: ArchivedVenuesProps) {
  const [venues, setVenues] = useState<ArchivedVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArchivedVenues();
  }, [filters]);

  const fetchArchivedVenues = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
      const response = await fetch(`/api/admin/archive/venues?${params}`);

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des venues archivés');
      }

      const data = await response.json();
      setVenues(data.venues || []);
    } catch (err) {
      console.error('Error fetching archived venues:', err);
      setError('Erreur lors du chargement des venues archivés');
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreVenue = async (venueId: string) => {
    try {
      const response = await fetch(`/api/admin/venues/${venueId}/archive`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la restauration');
      }

      fetchArchivedVenues();
    } catch (err) {
      console.error('Error restoring venue:', err);
      setError('Erreur lors de la restauration du venue');
    }
  };

  const getStatusColor = () => {
    return 'bg-orange-100 text-orange-800';
  };

  const getStatusLabel = () => {
    return 'Archivé';
  };

  if (loading) {
    return (
      <div className="py-12">
        <Loading text="Chargement des venues archivés..." size="lg" />
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

  if (venues.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun venue archivé</h3>
        <p className="text-gray-600">
          {filters.search ? 'Aucun résultat pour cette recherche.' : 'Tous les venues sont actifs.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {venues.length} venue{venues.length > 1 ? 's' : ''} archivé{venues.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-4">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{venue.name}</h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
                    >
                      {getStatusLabel()}
                    </span>
                  </div>
                  {venue.address && <p className="text-gray-600 text-sm mt-1">{venue.address}</p>}

                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    {venue.type && <span>Type: {venue.type}</span>}
                    {venue.city && <span>Ville: {venue.city}</span>}
                  </div>

                  {venue.archivedAt && (
                    <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Archivé le {new Date(venue.archivedAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      {venue.archivedBy && <span>Par {venue.archivedBy}</span>}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRestoreVenue(venue.id)}
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
