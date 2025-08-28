'use client';

import AdminFilters, { FilterConfig } from '../common/AdminFilters';

interface EventsFiltersProps {
  filters: {
    search: string;
    eventType: string;
    dateSort: string;
    status: string;
  };
  onFiltersChange: (filters: {
    search: string;
    eventType: string;
    dateSort: string;
    status: string;
  }) => void;
}

export default function EventsFilters({ filters, onFiltersChange }: EventsFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const filterConfigs: FilterConfig[] = [
    {
      key: 'search',
      label: 'Recherche',
      type: 'search',
      placeholder: 'Rechercher des événements...',
      value: filters.search,
    },
    {
      key: 'eventType',
      label: "Type d'événement",
      type: 'select',
      value: filters.eventType,
      options: [
        { value: 'all', label: 'Tous les types' },
        { value: 'JAM', label: 'Jam Session' },
        { value: 'CONCERT', label: 'Concert' },
        { value: 'RECORDING', label: 'Session d&apos;enregistrement' },
        { value: 'WORKSHOP', label: 'Atelier' },
        { value: 'MEETING', label: 'Réunion' },
        { value: 'OTHER', label: 'Autre' },
      ],
    },
    {
      key: 'dateSort',
      label: 'Tri par date',
      type: 'select',
      value: filters.dateSort,
      options: [
        { value: 'newest', label: 'Plus récent' },
        { value: 'oldest', label: 'Plus ancien' },
      ],
    },
    {
      key: 'status',
      label: 'Statut',
      type: 'select',
      value: filters.status,
      options: [
        { value: 'all', label: 'Tous les statuts' },
        { value: 'upcoming', label: 'À venir' },
        { value: 'past', label: 'Passés' },
        { value: 'today', label: "Aujourd'hui" },
      ],
    },
  ];

  return <AdminFilters filters={filterConfigs} onFilterChange={handleFilterChange} />;
}
