'use client';

import AdminFilters, { FilterConfig } from '../common/AdminFilters';

interface VenuesFiltersProps {
  filters: {
    search: string;
    venueType: string;
    status: string;
  };
  onFiltersChange: (filters: { search: string; venueType: string; status: string }) => void;
}

export default function VenuesFilters({ filters, onFiltersChange }: VenuesFiltersProps) {
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
      placeholder: 'Rechercher des lieux...',
      value: filters.search,
    },
    {
      key: 'venueType',
      label: 'Type de lieu',
      type: 'select',
      value: filters.venueType,
      options: [
        { value: 'all', label: 'Tous les types' },
        { value: 'CAMPUS', label: 'Campus ISEP' },
        { value: 'CONCERT_HALL', label: 'Salle de concert' },
        { value: 'REHEARSAL_ROOM', label: 'Salle de répétition' },
        { value: 'RECORDING_STUDIO', label: 'Studio d&apos;enregistrement' },
        { value: 'BAR', label: 'Bar' },
        { value: 'RESTAURANT', label: 'Restaurant' },
        { value: 'NIGHTCLUB', label: 'Boîte de nuit' },
        { value: 'EXTERNAL', label: 'Lieu externe' },
        { value: 'OTHER', label: 'Autre' },
      ],
    },
    {
      key: 'status',
      label: 'Statut',
      type: 'select',
      value: filters.status,
      options: [
        { value: 'all', label: 'Tous les statuts' },
        { value: 'ACTIVE', label: 'Actif' },
        { value: 'INACTIVE', label: 'Inactif' },
        { value: 'AVOID', label: 'À éviter' },
      ],
    },
  ];

  return <AdminFilters filters={filterConfigs} onFilterChange={handleFilterChange} />;
}
