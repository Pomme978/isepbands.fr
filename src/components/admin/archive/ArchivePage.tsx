'use client';

import { useState } from 'react';
import { Archive, Users, UserCheck, Calendar, FileText } from 'lucide-react';
import AdminPageHeader from '../common/AdminPageHeader';
import AdminFilters, { FilterConfig } from '../common/AdminFilters';
import ArchivedUsers from './ArchivedUsers';
import ArchivedGroups from './ArchivedGroups';
import ArchivedEvents from './ArchivedEvents';
import ArchivedPosts from './ArchivedPosts';

type ArchiveCategory = 'users' | 'groups' | 'events' | 'posts';

const categories = [
  {
    id: 'users' as ArchiveCategory,
    label: 'Comptes archivés',
    icon: Users,
    description: 'Utilisateurs supprimés ou suspendus',
  },
  {
    id: 'groups' as ArchiveCategory,
    label: 'Groupes archivés',
    icon: UserCheck,
    description: 'Groupes dissous ou inactifs',
  },
  {
    id: 'events' as ArchiveCategory,
    label: 'Événements archivés',
    icon: Calendar,
    description: 'Événements passés ou annulés',
  },
  {
    id: 'posts' as ArchiveCategory,
    label: 'Posts du feed archivés',
    icon: FileText,
    description: 'Publications supprimées ou masquées',
  },
];

export default function ArchivePage() {
  const [activeCategory, setActiveCategory] = useState<ArchiveCategory>('users');
  const [filterValues, setFilterValues] = useState({
    search: '',
    sortBy: 'newest',
    dateRange: 'all',
  });

  const filterConfig: FilterConfig[] = [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Rechercher dans les archives...',
      value: filterValues.search,
    },
    {
      key: 'sortBy',
      label: 'Trier par',
      type: 'select',
      value: filterValues.sortBy,
      options: [
        { value: 'newest', label: 'Plus récent' },
        { value: 'oldest', label: 'Plus ancien' },
        { value: 'alphabetical', label: 'Alphabétique' },
      ],
    },
    {
      key: 'dateRange',
      label: 'Période',
      type: 'select',
      value: filterValues.dateRange,
      options: [
        { value: 'all', label: 'Toutes les périodes' },
        { value: 'week', label: 'Cette semaine' },
        { value: 'month', label: 'Ce mois' },
        { value: 'quarter', label: 'Ce trimestre' },
        { value: 'year', label: 'Cette année' },
      ],
    },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const renderActiveCategory = () => {
    switch (activeCategory) {
      case 'users':
        return <ArchivedUsers filters={filterValues} />;
      case 'groups':
        return <ArchivedGroups filters={filterValues} />;
      case 'events':
        return <ArchivedEvents filters={filterValues} />;
      case 'posts':
        return <ArchivedPosts filters={filterValues} />;
      default:
        return <ArchivedUsers filters={filterValues} />;
    }
  };

  const activeCategoryObj = categories.find((cat) => cat.id === activeCategory);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Archives"
        description="Gestion et consultation des éléments archivés"
        icon={Archive}
      />

      {/* Category Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  isActive
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
                  <span className="font-medium">{category.label}</span>
                </div>
                <p className="text-sm text-gray-500">{category.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <AdminFilters filters={filterConfig} onFilterChange={handleFilterChange} />

      {/* Active Category Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {activeCategoryObj && (
              <>
                <activeCategoryObj.icon className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{activeCategoryObj.label}</h2>
                  <p className="text-sm text-gray-600">{activeCategoryObj.description}</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="p-6">{renderActiveCategory()}</div>
      </div>
    </div>
  );
}
