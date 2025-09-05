'use client';

import { Search } from 'lucide-react';

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'search';
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  value: string;
}

interface AdminFiltersProps {
  filters: FilterConfig[];
  onFilterChange: (key: string, value: string) => void;
  className?: string;
}

export default function AdminFilters({
  filters,
  onFilterChange,
  className = '',
}: AdminFiltersProps) {
  const searchFilter = filters.find((f) => f.type === 'search');
  const selectFilters = filters.filter((f) => f.type === 'select');

  return (
    <div className={`bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="flex flex-col gap-4">
        {/* Search Filter */}
        {searchFilter && (
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={searchFilter.placeholder || 'Search...'}
                value={searchFilter.value}
                onChange={(e) => onFilterChange(searchFilter.key, e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>
        )}

        {/* Select Filters */}
        {selectFilters.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {selectFilters.map((filter) => (
              <div key={filter.key} className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-gray-700 mb-1 sm:hidden">
                  {filter.label}
                </label>
                <select
                  value={filter.value}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  {filter.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
