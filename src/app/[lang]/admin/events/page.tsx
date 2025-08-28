'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import EventsList from '@/components/admin/events/EventsList';
import EventsFilters from '@/components/admin/events/EventsFilters';
import CreateEventModal from '@/components/admin/events/CreateEventModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function AdminEventsPage() {
  const [filters, setFilters] = useState({
    search: '',
    eventType: 'all',
    dateSort: 'newest',
    status: 'all',
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Événements</h1>
            <p className="text-gray-600 mt-1">
              Gérez les événements, concerts, jams et sessions d&apos;enregistrement
            </p>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            size="lg"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Créer un événement
          </Button>
        </div>

        {/* Filters */}
        <EventsFilters filters={filters} onFiltersChange={setFilters} />

        {/* Events List */}
        <EventsList filters={filters} refreshTrigger={refreshTrigger} />

        {/* Create Modal */}
        <CreateEventModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onEventCreated={triggerRefresh}
        />
      </div>
    </AdminLayout>
  );
}
