'use client';

import { useState, useEffect } from 'react';
import { User, Calendar, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArchivedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  promotion?: string;
  photoUrl?: string;
  archivedAt: string;
  archivedBy: string;
  status: string;
}

interface ArchivedUsersProps {
  filters: {
    search: string;
    sortBy: string;
    dateRange: string;
  };
}

export default function ArchivedUsers({ filters }: ArchivedUsersProps) {
  const [users, setUsers] = useState<ArchivedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArchivedUsers();
  }, [filters]);

  const fetchArchivedUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
      console.log('Fetching archived users with params:', params.toString());

      const response = await fetch(`/api/admin/archive/users?${params}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
        throw new Error(errorData.error || 'Erreur lors du chargement des utilisateurs archivés');
      }

      const data = await response.json();
      console.log('Received archived users data:', data);
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching archived users:', err);
      setError(
        err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs archivés',
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/archive`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la restauration');
      }

      // Refresh the list after restoration
      fetchArchivedUsers();
    } catch (err) {
      console.error('Error restoring user:', err);
      setError("Erreur lors de la restauration de l'utilisateur");
    }
  };

  const getStatusColor = (status: string) => {
    return 'bg-orange-100 text-orange-800';
  };

  const getStatusLabel = (status: string) => {
    return 'Archivé';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-gray-600">Chargement des utilisateurs archivés...</span>
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

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur archivé</h3>
        <p className="text-gray-600">
          {filters.search
            ? 'Aucun résultat pour cette recherche.'
            : 'Tous les utilisateurs sont actifs.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {users.length} utilisateur{users.length > 1 ? 's' : ''} archivé
          {users.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  {user.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}
                    >
                      {getStatusLabel(user.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                  {user.promotion && (
                    <p className="text-gray-500 text-xs">Promotion: {user.promotion}</p>
                  )}

                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Archivé le {new Date(user.archivedAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <span>Par {user.archivedBy}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRestoreUser(user.id)}
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
