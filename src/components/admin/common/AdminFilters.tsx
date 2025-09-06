'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const [showFilters, setShowFilters] = useState(false);
  const searchFilter = filters.find((f) => f.type === 'search');
  const selectFilters = filters.filter((f) => f.type === 'select');

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Mobile: Search + Toggle Button */}
      <div className="sm:hidden">
        <div className="p-4 border-b border-gray-200">
          {searchFilter && (
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder={searchFilter.placeholder || 'Search...'}
                value={searchFilter.value}
                onChange={(e) => onFilterChange(searchFilter.key, e.target.value)}
                className="pl-10"
              />
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
          </Button>
        </div>

        {/* Mobile: Collapsible Filters */}
        {showFilters && selectFilters.length > 0 && (
          <div className="p-4 space-y-3">
            {selectFilters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>
                <Select
                  value={filter.value}
                  onValueChange={(value) => onFilterChange(filter.key, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: All filters visible */}
      <div className="hidden sm:block p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          {/* Search Filter */}
          {searchFilter && (
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder={searchFilter.placeholder || 'Search...'}
                  value={searchFilter.value}
                  onChange={(e) => onFilterChange(searchFilter.key, e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          {/* Select Filters */}
          {selectFilters.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {selectFilters.map((filter) => (
                <div key={filter.key} className="flex-1 min-w-0">
                  <Select
                    value={filter.value}
                    onValueChange={(value) => onFilterChange(filter.key, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
