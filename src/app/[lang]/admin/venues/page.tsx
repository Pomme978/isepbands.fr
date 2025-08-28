'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import VenuesList from '@/components/admin/venues/VenuesList';
import VenuesFilters from '@/components/admin/venues/VenuesFilters';
import CreateVenueModal from '@/components/admin/venues/CreateVenueModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Venue type definition
interface Venue {
  id: string;
  name: string;
  description: string | null;
  venueType:
    | 'CAMPUS'
    | 'CONCERT_HALL'
    | 'REHEARSAL_ROOM'
    | 'RECORDING_STUDIO'
    | 'BAR'
    | 'RESTAURANT'
    | 'NIGHTCLUB'
    | 'EXTERNAL'
    | 'OTHER';
  address: string;
  city: string;
  postalCode: string | null;
  country: string;
  photoUrl: string | null;
  metroLine: string | null;
  accessInstructions: string | null;
  staffNotes: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'AVOID';
  createdAt: string;
  updatedAt: string;
  events: Array<{ id: number; name: string; date: string }>;
  eventsCount?: number;
}

export default function AdminVenuesPage() {
  const [filters, setFilters] = useState({
    search: '',
    venueType: 'all',
    status: 'all',
  });

  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Fonction pour récupérer les venues depuis l'API
  const fetchVenues = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/venues');
      if (!response.ok) {
        throw new Error('Failed to fetch venues');
      }
      const data = await response.json();
      if (data.success) {
        // Transform data to match expected format
        const venuesWithEventsCount = data.venues.map((venue) => ({
          ...venue,
          eventsCount: venue.events?.length || 0,
        }));
        setVenues(venuesWithEventsCount);
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
      // Fallback to empty array on error
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [refreshTrigger]);

  // Filter venues based on current filters
  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      venue.city.toLowerCase().includes(filters.search.toLowerCase());

    const matchesType = filters.venueType === 'all' || venue.venueType === filters.venueType;
    const matchesStatus = filters.status === 'all' || venue.status === filters.status;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Lieux</h1>
            <p className="text-gray-600">Gérer les lieux pour les événements et répétitions</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajouter un lieu
          </Button>
        </div>

        {/* Filters */}
        <VenuesFilters filters={filters} onFiltersChange={setFilters} />

        {/* Venues List */}
        <VenuesList venues={filteredVenues} loading={loading} onVenueUpdated={triggerRefresh} />

        {/* Create Venue Modal */}
        <CreateVenueModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onVenueCreated={triggerRefresh}
        />
      </div>
    </AdminLayout>
  );
}
