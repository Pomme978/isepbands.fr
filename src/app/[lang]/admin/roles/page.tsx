'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Loading from '@/components/ui/Loading';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  Users,
  Settings,
  Palette,
  CheckCircle2,
  XCircle,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react';
import BadgeDisplay from '@/components/profile/BadgeDisplay';
import ColorEditor from '@/components/admin/roles/ColorEditor';

interface Permission {
  id: number;
  name: string;
  nameFr: string;
  nameEn: string;
  description?: string;
}

interface Role {
  id: number;
  name: string;
  nameFrMale: string;
  nameFrFemale: string;
  nameEnMale: string;
  nameEnFemale: string;
  weight: number;
  isCore: boolean;
  userCount: number;
  maxUsers: number;
  isAvailable: boolean;
  spotsLeft: number;
  permissions: Permission[];
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Fetch roles and permissions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [rolesResponse, permissionsResponse] = await Promise.all([
          fetch('/api/admin/roles'),
          fetch('/api/admin/permissions'),
        ]);

        if (!rolesResponse.ok || !permissionsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const rolesData = await rolesResponse.json();
        const permissionsData = await permissionsResponse.json();

        setRoles(rolesData.roles || []);
        setPermissions(permissionsData.permissions || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Impossible de charger les rôles et permissions');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRoleDisplayName = (role: Role, pronouns: string = 'they/them'): string => {
    if (pronouns === 'she/her') {
      return role.nameFrFemale;
    } else if (pronouns === 'he/him') {
      return role.nameFrMale;
    }
    return role.nameFrMale; // Default fallback
  };

  const handleEditColor = (role: Role) => {
    setEditingRole(role);
  };

  const handleSaveColor = async (gradientStart: string, gradientEnd: string) => {
    if (!editingRole) return;

    try {
      const response = await fetch(`/api/admin/roles/${editingRole.id}/colors`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gradientStart,
          gradientEnd,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save role colors');
      }

      const data = await response.json();
      console.log('Role colors saved:', data);

      // Show success message
      setError(null);
      alert('Couleurs sauvegardées avec succès !');
    } catch (error) {
      console.error('Error saving role colors:', error);
      setError('Erreur lors de la sauvegarde des couleurs');
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold">Rôles & Permissions</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Gérez les rôles de l'association et leurs permissions
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau rôle
            </Button>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle permission
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loading text="Chargement des rôles et permissions..." size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Roles List */}
            <div className="xl:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Rôles ({roles.length})
                  </CardTitle>
                  <CardDescription>
                    Liste des rôles de l'association avec leurs permissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {/* Role Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <BadgeDisplay
                            role={getRoleDisplayName(role)}
                            badges={[]}
                            isLookingForGroup={false}
                            pronouns="they/them"
                            size="sm"
                          />
                          <div>
                            <h3 className="font-semibold text-lg">
                              {getRoleDisplayName(role)}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Users className="h-3 w-3" />
                              <span>
                                {role.userCount}/{role.maxUsers === 999 ? '∞' : role.maxUsers}{' '}
                                utilisateurs
                              </span>
                              <span className="text-gray-400">•</span>
                              <span>Poids: {role.weight}</span>
                              {role.isCore && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <Badge variant="outline" className="text-xs">
                                    Rôle principal
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditColor(role)}
                          >
                            <Palette className="h-3 w-3 mr-1" />
                            Couleurs
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Role Permissions */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Permissions ({role.permissions.length})
                        </h4>
                        {role.permissions.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.map((permission) => (
                              <Badge key={permission.id} variant="outline" className="text-xs">
                                {permission.nameFr}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">Aucune permission assignée</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Permissions List */}
            <div className="xl:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Permissions ({permissions.length})
                  </CardTitle>
                  <CardDescription>Toutes les permissions disponibles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{permission.nameFr}</h4>
                        <Badge variant="outline" className="text-xs">
                          {permission.name}
                        </Badge>
                      </div>
                      {permission.description && (
                        <p className="text-xs text-gray-600">{permission.description}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Color Editor Modal */}
        <ColorEditor
          roleName={editingRole ? getRoleDisplayName(editingRole) : ''}
          isOpen={!!editingRole}
          onClose={() => setEditingRole(null)}
          onSave={handleSaveColor}
        />
      </div>
    </AdminLayout>
  );
}