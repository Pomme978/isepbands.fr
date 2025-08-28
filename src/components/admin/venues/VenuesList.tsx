'use client';

import { useState } from 'react';
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
  photoUrl?: string;
  metroLine?: string;
  accessInstructions?: string;
  staffNotes?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'AVOID';
  createdAt: string;
  eventsCount: number;
}

interface VenuesListProps {
  venues: Venue[];
  filters: {
    search: string;
    venueType: string;
    status: string;
  };
  loading?: boolean;
  onRefresh?: () => void;
}

export default function VenuesList({
  venues: allVenues,
  filters,
  loading = false,
  onRefresh,
}: VenuesListProps) {
  const [error, setError] = useState<string | null>(null);

  // Apply filters
  let filteredVenues = allVenues;

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

  const venues = filteredVenues;

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
          onClick={onRefresh || (() => {})}
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
    <div className="space-y-8">
      {/* Campus Venues - Default locations */}
      {campusVenues.length > 0 && (
        <AdminExpandableSection
          title="Lieux Campus ISEP"
          count={campusVenues.length}
          defaultExpanded={true}
        >
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
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
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {externalVenues.map((venue) => (
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
          className="border-gray-200 bg-gray-50/50"
        >
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {inactiveVenues.map((venue) => (
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
          className="border-red-200 bg-red-50/50"
        >
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {avoidVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </AdminExpandableSection>
      )}

      {/* No venues found */}
      {venues.length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun lieu trouvé</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Aucun lieu ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou
            ajoutez un nouveau lieu.
          </p>
        </div>
      )}
    </div>
  );
}
