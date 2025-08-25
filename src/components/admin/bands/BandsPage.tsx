'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AdminPageHeader, AdminFilters, AdminExpandableSection, FilterConfig } from '../common';

// Example of how to reuse the admin components for bands
export default function BandsPage() {
  const [filterValues, setFilterValues] = useState({
    search: '',
    status: 'all',
    recruitment: 'all',
    sortBy: 'alphabetical'
  });

  const filterConfig: FilterConfig[] = [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search bands by name or genre...',
      value: filterValues.search
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      value: filterValues.status,
      options: [
        { value: 'all', label: 'All Bands' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'disbanded', label: 'Disbanded' }
      ]
    },
    {
      key: 'recruitment',
      label: 'Recruitment',
      type: 'select',
      value: filterValues.recruitment,
      options: [
        { value: 'all', label: 'All' },
        { value: 'open', label: 'Open' },
        { value: 'closed', label: 'Closed' }
      ]
    },
    {
      key: 'sortBy',
      label: 'Sort By',
      type: 'select',
      value: filterValues.sortBy,
      options: [
        { value: 'alphabetical', label: 'Alphabetical' },
        { value: 'newest', label: 'Newest' },
        { value: 'members', label: 'Member Count' }
      ]
    }
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  // Mock data
  const activeBands = [
    { id: '1', name: 'The Rockers', memberCount: 4, status: 'active' },
    { id: '2', name: 'Jazz Collective', memberCount: 6, status: 'active' }
  ];
  
  const inactiveBands = [
    { id: '3', name: 'Electric Dreams', memberCount: 3, status: 'inactive' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Bands Management"
        description="Manage all musical groups and their members"
        actions={
          <button className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            New Band
          </button>
        }
      />

      {/* Filters */}
      <AdminFilters 
        filters={filterConfig}
        onFilterChange={handleFilterChange}
      />

      {/* Bands List */}
      <div className="space-y-6">
        <AdminExpandableSection
          title="Active Bands"
          count={activeBands.length}
          defaultExpanded={true}
        >
          <div className="space-y-4">
            {activeBands.map(band => (
              <div key={band.id} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">{band.name}</h4>
                <p className="text-sm text-gray-600">{band.memberCount} members</p>
              </div>
            ))}
          </div>
        </AdminExpandableSection>

        <AdminExpandableSection
          title="Inactive Bands"
          count={inactiveBands.length}
          defaultExpanded={false}
        >
          <div className="space-y-4">
            {inactiveBands.map(band => (
              <div key={band.id} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">{band.name}</h4>
                <p className="text-sm text-gray-600">{band.memberCount} members</p>
              </div>
            ))}
          </div>
        </AdminExpandableSection>
      </div>
    </div>
  );
}