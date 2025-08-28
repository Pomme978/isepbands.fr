'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import VenueEditPage from '@/components/admin/venues/VenueEditPage';
import Loading from '@/components/ui/Loading';

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
  events: Array<{ id: number; name: string; date: string; type: string }>;
  eventsCount: number;
}

export default function AdminVenueDetailPage() {
  const params = useParams();
  const venueId = params?.venueId as string;
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenue = async () => {
      setLoading(true);
      try {
        console.log('Fetching venue with ID:', venueId);
        const response = await fetch(`/api/admin/venues/${venueId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('Lieu non trouvé');
          } else {
            setError('Erreur lors du chargement du lieu');
          }
          return;
        }

        const data = await response.json();
        if (data.success) {
          setVenue(data.venue);
        } else {
          setError('Erreur lors du chargement du lieu');
        }
      } catch (err) {
        setError('Erreur lors du chargement du lieu');
        console.error('Error fetching venue:', err);
      } finally {
        setLoading(false);
      }
    };

    if (venueId) {
      fetchVenue();
    }
  }, [venueId]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-12">
          <Loading text="Chargement du lieu..." size="lg" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !venue) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">{error || 'Lieu non trouvé'}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <VenueEditPage venue={venue} onVenueUpdate={setVenue} />
    </AdminLayout>
  );
}
