'use client';

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { RecentActivity } from '@/components/home/RecentActivity';
import { ArrowLeft, Search, Filter, X } from 'lucide-react';
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
  };

  const activitiesByMonth = useMemo(() => {
    const groups: { [key: string]: ActivityType[] } = {};

    filteredActivities.forEach((activity) => {
      const monthKey = format(activity.timestamp, 'MMMM yyyy', { locale: fr });
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(activity);
    });

    return Object.entries(groups).map(([month, activities]) => ({
      month,
      activities,
    }));
  }, [filteredActivities]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] h-[95vh] p-0 sm:rounded-lg flex flex-col z-100">
        <DialogHeader className="flex-shrink-0 bg-white border-b px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={onClose} className="md:hidden p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredActivities.length} activité{filteredActivities.length !== 1 ? 's' : ''}{' '}
                  trouvée{filteredActivities.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={onClose} className="hidden md:flex p-2">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher dans l'historique..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
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
                onValueChange={(value: ActivityTypeFilter) => setTypeFilter(value)}
              >
                <SelectTrigger>
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

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Plus
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-3">Filtres avancés</h4>

              {periodFilter === 'custom' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Date de début
                    </label>
                    <Input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
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
                    />
                  </div>
                </div>
              )}

              <Button variant="outline" size="sm" onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
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
                    <span className="px-4 text-sm font-medium text-gray-500 bg-white">{month}</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>
                  <RecentActivity activities={activities} showHistoryButton={false} />
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
