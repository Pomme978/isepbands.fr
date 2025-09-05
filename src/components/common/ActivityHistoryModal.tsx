'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { ActivityType } from '@/types/activity';
import ActivityItem from '@/components/admin/dashboard/ActivityItem';
import {
  ArrowLeft,
  Search,
  Filter,
  X,
  History,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Edit3,
  Shield,
  LogIn,
  CheckCircle,
} from 'lucide-react';
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

interface ActivityHistoryModalProps {
  activities: ActivityType[];
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

type FilterPeriod = 'all' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear' | 'custom';
type ActivityTypeFilter = 'all' | ActivityType['type'];

export const ActivityHistoryModal = ({
  activities,
  isOpen,
  onClose,
  title = 'Historique complet des activités',
}: ActivityHistoryModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState<FilterPeriod>('all');
  const [typeFilter, setTypeFilter] = useState<ActivityTypeFilter>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const ITEMS_PER_PAGE = 20;

  const filteredActivities = useMemo(() => {
    let filtered = [...activities];

    // Filtrage par période
    const now = new Date();
    if (periodFilter !== 'all') {
      filtered = filtered.filter((activity) => {
        const activityDate = activity.timestamp;

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
            if (customStartDate && customEndDate) {
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

    // Filtrage par type d'activité
    if (typeFilter !== 'all') {
      filtered = filtered.filter((activity) => activity.type === typeFilter);
    }

    // Filtrage par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.description.toLowerCase().includes(query) ||
          activity.user?.name?.toLowerCase().includes(query) ||
          activity.user?.role?.toLowerCase().includes(query) ||
          activity.groupName?.toLowerCase().includes(query) ||
          activity.eventTitle?.toLowerCase().includes(query),
      );
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [activities, searchQuery, periodFilter, typeFilter, customStartDate, customEndDate]);

  const resetFilters = () => {
    setSearchQuery('');
    setPeriodFilter('all');
    setTypeFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setCurrentPage(1);
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  // Paginated activities
  const paginatedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredActivities.slice(startIndex, endIndex);
  }, [filteredActivities, currentPage]);

  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);

  // Helper functions for activity display
  const getActivityIconAndColor = (type: string) => {
    switch (type) {
      case 'user_approved':
      case 'user_restored':
        return { icon: UserCheck, iconColor: 'text-green-600', iconBgColor: 'bg-green-100' };
      case 'user_rejected':
      case 'user_archived':
        return { icon: UserX, iconColor: 'text-red-600', iconBgColor: 'bg-red-100' };
      case 'profile_updated':
      case 'user_edited':
        return { icon: Edit3, iconColor: 'text-amber-600', iconBgColor: 'bg-amber-100' };
      case 'role_assigned':
      case 'permissions_updated':
        return { icon: Shield, iconColor: 'text-purple-600', iconBgColor: 'bg-purple-100' };
      case 'user_login':
      case 'root_login':
        return { icon: LogIn, iconColor: 'text-blue-600', iconBgColor: 'bg-blue-100' };
      default:
        return { icon: CheckCircle, iconColor: 'text-gray-600', iconBgColor: 'bg-gray-100' };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[98vh] sm:max-h-[95vh] h-[98vh] sm:h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <History className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{title}</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {filteredActivities.length} activité{filteredActivities.length !== 1 ? 's' : ''}{' '}
                trouvée{filteredActivities.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-3 sm:p-6 border-b border-gray-200">
          <div className="relative mb-3 sm:mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher dans l'historique..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                value={periodFilter}
                onValueChange={(value: FilterPeriod) => setPeriodFilter(value)}
              >
                <SelectTrigger className="text-sm">
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

              <Select
                value={typeFilter}
                onValueChange={(value: ActivityTypeFilter) => setTypeFilter(value)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Type d'activité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="post">Publications</SelectItem>
                  <SelectItem value="post_with_image">Publications avec image</SelectItem>
                  <SelectItem value="new_member">Nouveaux membres</SelectItem>
                  <SelectItem value="new_group">Nouveaux groupes</SelectItem>
                  <SelectItem value="event">Événements</SelectItem>
                  <SelectItem value="announcement">Annonces</SelectItem>
                  <SelectItem value="system_announcement">Annonces système</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 sm:flex-none text-sm"
                size="sm"
              >
                <Filter className="h-4 w-4 mr-2" />
                Plus de filtres
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="flex-1 sm:flex-none text-sm"
              >
                Réinitialiser
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-3">Filtres avancés</h4>

              {periodFilter === 'custom' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Date de début
                    </label>
                    <Input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Date de fin
                    </label>
                    <Input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-3 sm:p-6">
            {paginatedActivities.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-500 mb-4 text-sm sm:text-base">
                  Aucune activité trouvée avec ces filtres
                </p>
                <Button variant="outline" onClick={resetFilters} size="sm">
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {paginatedActivities.map((activity) => {
                  const colors = getActivityIconAndColor(activity.type);
                  return (
                    <ActivityItem
                      key={activity.id}
                      title={activity.description}
                      description={activity.user?.name ? `Par ${activity.user.name}` : ''}
                      timestamp={activity.timestamp.toISOString()}
                      icon={colors.icon}
                      iconColor={colors.iconColor}
                      iconBgColor={colors.iconBgColor}
                      createdBy={activity.user?.name}
                      isExpanded={expandedItems.has(activity.id)}
                      onToggleExpand={() => toggleExpanded(activity.id)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {currentPage} sur {totalPages} ({filteredActivities.length} activité
                  {filteredActivities.length !== 1 ? 's' : ''} au total)
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
