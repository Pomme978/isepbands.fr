'use client';

import { useState, useEffect } from 'react';
import { UserCheck, Calendar, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArchivedGroup {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  createdAt: string;
  archivedAt: string;
  archivedBy: string;
  reason?: string;
  status: 'DISSOLVED' | 'INACTIVE' | 'DELETED';
}

interface ArchivedGroupsProps {
  filters: {
    search: string;
    sortBy: string;
    dateRange: string;
  };
}

export default function ArchivedGroups({ filters }: ArchivedGroupsProps) {
  const [groups, setGroups] = useState<ArchivedGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArchivedGroups();
  }, [filters]);

  const fetchArchivedGroups = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // Mock data for now
      setGroups([
        {
          id: '1',
          name: 'Les Rockeurs ISEP',
          description: 'Groupe de rock des étudiants ISEP',
          memberCount: 5,
          createdAt: '2023-09-01',
          archivedAt: '2024-01-15',
          archivedBy: 'Admin',
          reason: "Groupe dissous par manque d'activité",
          status: 'DISSOLVED',
        },
      ]);
    } catch (err) {
      setError('Erreur lors du chargement des groupes archivés');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreGroup = async (groupId: string) => {
    try {
      console.log('Restoring group:', groupId);
      fetchArchivedGroups();
    } catch (err) {
      console.error('Error restoring group:', err);
    }
  };

  const getStatusColor = (status: ArchivedGroup['status']) => {
    switch (status) {
      case 'DISSOLVED':
        return 'bg-orange-100 text-orange-800';
      case 'INACTIVE':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: ArchivedGroup['status']) => {
    switch (status) {
      case 'DISSOLVED':
        return 'Dissous';
      case 'INACTIVE':
        return 'Inactif';
      case 'DELETED':
        return 'Supprimé';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-gray-600">Chargement des groupes archivés...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
        <span className="text-red-600">{error}</span>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun groupe archivé</h3>
        <p className="text-gray-600">
          {filters.search
            ? 'Aucun résultat pour cette recherche.'
            : 'Tous les groupes sont actifs.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {groups.length} groupe{groups.length > 1 ? 's' : ''} archivé{groups.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-primary" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{group.name}</h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(group.status)}`}
                    >
                      {getStatusLabel(group.status)}
                    </span>
                  </div>
                  {group.description && (
                    <p className="text-gray-600 text-sm mt-1">{group.description}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    {group.memberCount} membre{group.memberCount > 1 ? 's' : ''}
                  </p>

                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Archivé le {new Date(group.archivedAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <span>Par {group.archivedBy}</span>
                  </div>

                  {group.reason && (
                    <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      <strong>Raison:</strong> {group.reason}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRestoreGroup(group.id)}
                  className="flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Restaurer
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
