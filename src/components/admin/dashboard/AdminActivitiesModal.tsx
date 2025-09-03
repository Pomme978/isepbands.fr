'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ActivityItem from './ActivityItem';
import { Search, X, Filter, User } from 'lucide-react';
import {
  format,
  isAfter,
  isBefore,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';

interface ActivityData {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'success' | 'info' | 'warning' | 'error' | 'default';
  icon: React.ComponentType<{ className?: string }>;
  metadata?: Record<string, unknown>;
  adminAction?: {
    adminName: string;
    adminRole?: string;
  };
}

interface AdminActivitiesModalProps {
  activities: ActivityData[];
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

type FilterPeriod = 'all' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear' | 'custom';

export default function AdminActivitiesModal({
  activities,
  isOpen,
  onClose,
  title = 'Toutes les activités administratives',
}: AdminActivitiesModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'success' | 'info' | 'warning' | 'error'>(
    'all',
  );
  const [periodFilter, setPeriodFilter] = useState<FilterPeriod>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [userFilter, setUserFilter] = useState<string>('all');

  // Extract unique users from activities
  const uniqueUsers = useMemo(() => {
    const users = new Set<string>();
    activities.forEach((activity) => {
      if (activity.adminAction?.adminName) {
        users.add(activity.adminAction.adminName);
      }
    });
    return Array.from(users).sort();
  }, [activities]);

  const filteredActivities = useMemo(() => {
    let filtered = [...activities];

    // Filtrage par période
    if (periodFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter((activity) => {
        // Parse la date depuis le timestamp formaté français
        const dateMatch = activity.timestamp.match(/(\d{1,2})\s+(\w+)\s+(\d{1,2}):(\d{2})/);
        if (!dateMatch) return true;

        const [, day, monthName, hour, minute] = dateMatch;
        const monthNames = [
          'janvier',
          'février',
          'mars',
          'avril',
          'mai',
          'juin',
          'juillet',
          'août',
          'septembre',
          'octobre',
          'novembre',
          'décembre',
        ];
        const monthIndex = monthNames.findIndex((m) => monthName.toLowerCase().includes(m));
        if (monthIndex === -1) return true;

        const activityDate = new Date(now.getFullYear(), monthIndex, parseInt(day));

        switch (periodFilter) {
          case 'thisMonth':
            return (
              isAfter(activityDate, startOfMonth(now)) && isBefore(activityDate, endOfMonth(now))
            );
          case 'lastMonth':
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            return (
              isAfter(activityDate, startOfMonth(lastMonth)) &&
              isBefore(activityDate, endOfMonth(lastMonth))
            );
          case 'thisYear':
            return (
              isAfter(activityDate, startOfYear(now)) && isBefore(activityDate, endOfYear(now))
            );
          case 'lastYear':
            const lastYear = new Date(now.getFullYear() - 1, 0, 1);
            return (
              isAfter(activityDate, startOfYear(lastYear)) &&
              isBefore(activityDate, endOfYear(lastYear))
            );
          case 'custom':
            if (dateRange?.from && dateRange?.to) {
              return isAfter(activityDate, dateRange.from) && isBefore(activityDate, dateRange.to);
            } else if (customStartDate && customEndDate) {
              return (
                isAfter(activityDate, new Date(customStartDate)) &&
                isBefore(activityDate, new Date(customEndDate))
              );
            }
            return true;
          default:
            return true;
        }
      });
    }

    // Filtrage par type
    if (typeFilter !== 'all') {
      filtered = filtered.filter((activity) => activity.type === typeFilter);
    }

    // Filtrage par utilisateur
    if (userFilter !== 'all') {
      filtered = filtered.filter((activity) => activity.adminAction?.adminName === userFilter);
    }

    // Filtrage par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(query) ||
          activity.description.toLowerCase().includes(query) ||
          activity.adminAction?.adminName.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [
    activities,
    searchQuery,
    typeFilter,
    periodFilter,
    customStartDate,
    customEndDate,
    dateRange,
    userFilter,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setPeriodFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setDateRange(undefined);
    setExpandedId(null);
    setUserFilter('all');
  };

  const activitiesByMonth = useMemo(() => {
    const groups: { [key: string]: ActivityData[] } = {};

    filteredActivities.forEach((activity) => {
      // Parse the timestamp which is a formatted French date string
      const dateMatch = activity.timestamp.match(/(\d{1,2})\s+(\w+)\s+(\d{1,2}):(\d{2})/);
      if (dateMatch) {
        const [, day, monthName, hour, minute] = dateMatch;

        // Create a date object (using current year as fallback)
        const currentYear = new Date().getFullYear();
        const monthNames = [
          'janvier',
          'février',
          'mars',
          'avril',
          'mai',
          'juin',
          'juillet',
          'août',
          'septembre',
          'octobre',
          'novembre',
          'décembre',
        ];
        const monthIndex = monthNames.findIndex((m) => monthName.toLowerCase().includes(m));
        const date = new Date(currentYear, monthIndex >= 0 ? monthIndex : 0, parseInt(day));

        const monthKey = format(date, 'MMMM yyyy', { locale: fr });
        if (!groups[monthKey]) {
          groups[monthKey] = [];
        }
        groups[monthKey].push(activity);
      } else {
        // Fallback for activities that don't match expected format
        const monthKey = 'Récent';
        if (!groups[monthKey]) {
          groups[monthKey] = [];
        }
        groups[monthKey].push(activity);
      }
    });

    return Object.entries(groups)
      .sort(([a], [b]) => {
        if (a === 'Récent') return -1;
        if (b === 'Récent') return 1;
        return b.localeCompare(a);
      })
      .map(([month, activities]) => ({
        month,
        activities,
      }));
  }, [filteredActivities]);

  const getActivityColors = (type: ActivityData['type']) => {
    switch (type) {
      case 'success':
        return {
          iconColor: 'text-green-600',
          iconBgColor: 'bg-green-100',
        };
      case 'info':
        return {
          iconColor: 'text-blue-600',
          iconBgColor: 'bg-blue-100',
        };
      case 'warning':
        return {
          iconColor: 'text-yellow-600',
          iconBgColor: 'bg-yellow-100',
        };
      case 'error':
        return {
          iconColor: 'text-red-600',
          iconBgColor: 'bg-red-100',
        };
      default:
        return {
          iconColor: 'text-primary',
          iconBgColor: 'bg-primary/10',
        };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredActivities.length} activité{filteredActivities.length !== 1 ? 's' : ''}{' '}
              trouvée{filteredActivities.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher dans les activités..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <div className="flex-1">
              <Select
                value={periodFilter}
                onValueChange={(value: FilterPeriod) => setPeriodFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toute la période</SelectItem>
                  <SelectItem value="thisMonth">Ce mois-ci</SelectItem>
                  <SelectItem value="lastMonth">Mois dernier</SelectItem>
                  <SelectItem value="thisYear">Cette année</SelectItem>
                  <SelectItem value="lastYear">Année dernière</SelectItem>
                  <SelectItem value="custom">Période personnalisée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Select
                value={typeFilter}
                onValueChange={(value: typeof typeFilter) => setTypeFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type d'activité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="success">Succès</SelectItem>
                  <SelectItem value="info">Information</SelectItem>
                  <SelectItem value="warning">Avertissement</SelectItem>
                  <SelectItem value="error">Erreur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <SelectValue placeholder="Filtrer par utilisateur" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les utilisateurs</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {periodFilter === 'custom' && (
              <div className="flex-1">
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  placeholder="Sélectionner une période"
                />
              </div>
            )}

            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Plus
              </Button>

              <Button variant="outline" onClick={resetFilters}>
                Réinitialiser
              </Button>
            </div>
          </div>

          {showAdvancedFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <h4 className="font-medium text-sm mb-3">Filtres avancés</h4>

              <div className="text-sm text-gray-600">
                Utilisez le sélecteur de période ci-dessus pour filtrer par dates personnalisées.
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {activitiesByMonth.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Aucune activité trouvée avec ces filtres</p>
              <Button variant="outline" onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {activitiesByMonth.map(({ month, activities }) => (
                <div key={month}>
                  <div className="flex items-center mb-6">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="px-4 text-sm font-medium text-gray-500 bg-gray-50">
                      {month}
                    </span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>
                  <div className="bg-white rounded-lg border divide-y divide-gray-200">
                    {activities.map((activity) => {
                      const colors = getActivityColors(activity.type);
                      const createdBy = activity.adminAction
                        ? `${activity.adminAction.adminName}${activity.adminAction.adminRole ? ` (${activity.adminAction.adminRole})` : ''}`
                        : 'Système';

                      return (
                        <div key={activity.id} className="p-6">
                          <ActivityItem
                            title={activity.title}
                            description={activity.description}
                            timestamp={activity.timestamp}
                            icon={activity.icon}
                            iconColor={colors.iconColor}
                            iconBgColor={colors.iconBgColor}
                            createdBy={createdBy}
                            metadata={activity.metadata}
                            isExpanded={expandedId === activity.id}
                            onToggleExpand={() =>
                              setExpandedId(expandedId === activity.id ? null : activity.id)
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
