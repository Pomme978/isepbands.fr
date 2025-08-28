'use client';

import { useState, useEffect } from 'react';
import AdminExpandableSection from '../common/AdminExpandableSection';
import VenueCard from './VenueCard';
import Loading from '@/components/ui/Loading';

interface Venue {
  id: string;
  name: string;
  description?: string;
  venueType:
    | 'CAMPUS'
    | 'CONCERT_HALL'
    | 'REHEARSAL_ROOM'
    | 'RECORDING_STUDIO'
    | 'EXTERNAL'
    | 'OTHER';
  address: string;
  city: string;
  postalCode?: string;
  country: string;
  capacity?: number;
  photoUrl?: string;
  metroLine?: string;
  accessInstructions?: string;
  staffNotes?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'AVOID';
  createdAt: string;
  eventsCount: number;
}

interface VenuesListProps {
  filters: {
    search: string;
    venueType: string;
    status: string;
  };
  refreshTrigger?: number;
}

export default function VenuesList({ filters, refreshTrigger }: VenuesListProps) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVenues();
  }, [filters, refreshTrigger]);

  const fetchVenues = async () => {
    setLoading(true);
    setError(null);

    try {
      // Mock data for now since we don't have the API yet
      const mockVenues: Venue[] = [
        {
          id: '1',
          name: 'NDC - Salle de musique',
          description: 'Salle de musique principale du campus NDC',
          venueType: 'CAMPUS',
          address: '28 Rue Notre Dame des Champs',
          city: 'Paris',
          postalCode: '75006',
          country: 'France',
          capacity: 30,
          photoUrl: '/images/ndc-music-room.jpg',
          metroLine: 'Ligne 12 - Notre-Dame-des-Champs',
          accessInstructions: "Accès par l'entrée principale, 2ème étage",
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          eventsCount: 15,
        },
        {
          id: '2',
          name: 'NDL - Salle de répétition',
          description: 'Salle de répétition équipée du campus NDL',
          venueType: 'CAMPUS',
          address: '10 Rue de Vanves',
          city: 'Issy-les-Moulineaux',
          postalCode: '92130',
          country: 'France',
          capacity: 20,
          photoUrl: '/images/ndl-rehearsal-room.jpg',
          metroLine: 'Ligne 12 - Corentin Celton',
          accessInstructions: "Accès par l'entrée étudiants, sous-sol",
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          eventsCount: 8,
        },
        {
          id: '3',
          name: 'Salle de concert Neuilly',
          description: 'Grande salle de concert pour événements publics',
          venueType: 'CONCERT_HALL',
          address: '15 Avenue Charles de Gaulle',
          city: 'Neuilly-sur-Seine',
          postalCode: '92200',
          country: 'France',
          capacity: 200,
          photoUrl: '/images/neuilly-concert-hall.jpg',
          metroLine: 'Ligne 1 - Pont de Neuilly',
          accessInstructions: "Entrée artistes par l'arrière du bâtiment",
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          eventsCount: 5,
        },
        {
          id: '4',
          name: 'Studio Problématique',
          description: "Ancien studio avec problèmes d'acoustique",
          venueType: 'RECORDING_STUDIO',
          address: '25 Rue de la République',
          city: 'Boulogne-Billancourt',
          postalCode: '92100',
          country: 'France',
          capacity: 10,
          staffNotes: "À ÉVITER - Problèmes d'isolation phonique et équipement défaillant",
          status: 'AVOID',
          createdAt: new Date().toISOString(),
          eventsCount: 2,
        },
      ];

      // Apply filters
      let filteredVenues = mockVenues;

      // Search filter
      if (filters.search) {
        filteredVenues = filteredVenues.filter(
          (venue) =>
            venue.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            venue.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
            venue.address.toLowerCase().includes(filters.search.toLowerCase()) ||
            venue.city.toLowerCase().includes(filters.search.toLowerCase()),
        );
      }

      // Venue type filter
      if (filters.venueType !== 'all') {
        filteredVenues = filteredVenues.filter((venue) => venue.venueType === filters.venueType);
      }

      // Status filter
      if (filters.status !== 'all') {
        filteredVenues = filteredVenues.filter((venue) => venue.status === filters.status);
      }

      setVenues(filteredVenues);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch venues');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <Loading text="Chargement des lieux..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Erreur lors du chargement</div>
        <div className="text-gray-500 mb-4">{error}</div>
        <button
          onClick={fetchVenues}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Separate venues by type and status
  const campusVenues = venues.filter(
    (venue) => venue.venueType === 'CAMPUS' && venue.status === 'ACTIVE',
  );
  const externalVenues = venues.filter(
    (venue) => venue.venueType !== 'CAMPUS' && venue.status === 'ACTIVE',
  );
  const avoidVenues = venues.filter((venue) => venue.status === 'AVOID');
  const inactiveVenues = venues.filter((venue) => venue.status === 'INACTIVE');

  return (
    <div className="space-y-6">
      {/* Campus Venues - Default locations */}
      {campusVenues.length > 0 && (
        <AdminExpandableSection
          title="Lieux Campus ISEP"
          count={campusVenues.length}
          defaultExpanded={true}
        >
          <div className="space-y-4">
            {campusVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </AdminExpandableSection>
      )}

      {/* External Venues */}
      {externalVenues.length > 0 && (
        <AdminExpandableSection
          title="Lieux externes"
          count={externalVenues.length}
          defaultExpanded={true}
        >
          <div className="space-y-4">
            {externalVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </AdminExpandableSection>
      )}

      {/* Venues to Avoid - Special warning section */}
      {avoidVenues.length > 0 && (
        <AdminExpandableSection
          title="Lieux à éviter"
          count={avoidVenues.length}
          defaultExpanded={false}
          className="border-red-200 bg-red-50"
        >
          <div className="space-y-4">
            {avoidVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </AdminExpandableSection>
      )}

      {/* Inactive Venues */}
      {inactiveVenues.length > 0 && (
        <AdminExpandableSection
          title="Lieux inactifs"
          count={inactiveVenues.length}
          defaultExpanded={false}
        >
          <div className="space-y-4">
            {inactiveVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </AdminExpandableSection>
      )}

      {/* No venues found */}
      {venues.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">Aucun lieu trouvé</div>
          <p className="text-sm text-gray-400">
            Essayez de modifier vos filtres ou ajoutez un nouveau lieu
          </p>
        </div>
      )}
    </div>
  );
}
