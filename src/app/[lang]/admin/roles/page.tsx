'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import AdminDetailLayout from '@/components/admin/common/AdminDetailLayout';
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
  ArrowLeft,
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
  gradientStart?: string;
  gradientEnd?: string;
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
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

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

  const handleCreateRole = () => {
    console.log('TODO: Implémenter le modal de création de rôle');
    // setIsCreatingRole(true);
  };

  const handleEditRole = (role: Role) => {
    console.log(`TODO: Implémenter le modal d'édition de rôle pour ${getRoleDisplayName(role)}`);
    // setSelectedRole(role);
    // setIsEditingRole(true);
  };

  const handleCreatePermission = () => {
    console.log('TODO: Implémenter le modal de création de permission');
  };

  const handleSaveColor = async (gradientStart: string, gradientEnd: string): Promise<void> => {
    if (!editingRole) return;

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

    // Update the role in state
    setRoles(prev => prev.map(role => 
      role.id === editingRole.id 
        ? { ...role, gradientStart, gradientEnd }
        : role
    ));

    // Close the editor
    setEditingRole(null);
    setError(null);
    alert('Couleurs sauvegardées avec succès !');
  };

  // Loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loading text="Chargement des rôles et permissions..." size="lg" />
        </div>
      </AdminLayout>
    );
  }

  // Warning banners
  const warningBanners = [];
  if (error) {
    warningBanners.push(
      <Alert key="error" className="mb-6">
        <XCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Primary actions
  const primaryActions = [
    {
      label: 'Nouveau rôle',
      icon: Plus,
      onClick: handleCreateRole,
      variant: 'primary' as const,
    },
    {
      label: 'Nouvelle permission',
      icon: Plus,
      onClick: handleCreatePermission,
      variant: 'secondary' as const,
    }
  ];

  return (
    <AdminLayout>
      <AdminDetailLayout
        backHref="/admin"
        backLabel="Back to Dashboard"
        backMobileLabel="Dashboard"
        itemInfo={{
          title: "Rôles & Permissions",
          subtitle: "Gérez les rôles de l'association et leurs permissions",
          icon: Shield
        }}
        warningBanners={warningBanners}
        primaryActions={primaryActions}
      >
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 min-h-0">
          {/* Roles List */}
          <div className="xl:col-span-2">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Rôles ({roles.length})
                </CardTitle>
                <CardDescription>
                  Liste des rôles de l&apos;association avec leurs permissions
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
                        {/* Custom Role Badge with Database Colors */}
                        <span
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-white shadow-sm"
                          style={{
                            background: role.gradientStart && role.gradientEnd 
                              ? `linear-gradient(to right, ${role.gradientStart}, ${role.gradientEnd})`
                              : 'linear-gradient(to right, #6b7280, #4b5563)' // default gray fallback
                          }}
                        >
                          {getRoleDisplayName(role)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-lg truncate">{role.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>
                                {role.userCount}/{role.maxUsers === 999 ? '∞' : role.maxUsers}
                              </span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <span>Poids: {role.weight}</span>
                            {role.isCore && (
                              <>
                                <span className="text-gray-400">•</span>
                                <Badge 
                                  variant="outline" 
                                  className="text-xs"
                                  title="Rôle système par défaut, non supprimable"
                                >
                                  Système
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditColor(role)}>
                          <Palette className="h-3 w-3 md:mr-1" />
                          <span className="hidden md:inline">Couleurs</span>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditRole(role)}>
                          <Edit className="h-3 w-3" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                        {!role.isCore && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            title="Supprimer ce rôle"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">Supprimer</span>
                          </Button>
                        )}
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
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Permissions ({permissions.length})
                </CardTitle>
                <CardDescription>Toutes les permissions disponibles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 overflow-y-auto max-h-96">
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

        {/* Color Editor Modal */}
        <ColorEditor
          roleId={editingRole?.id || 0}
          roleName={editingRole ? getRoleDisplayName(editingRole) : ''}
          currentGradientStart={editingRole?.gradientStart}
          currentGradientEnd={editingRole?.gradientEnd}
          isOpen={!!editingRole}
          onClose={() => setEditingRole(null)}
          onSave={handleSaveColor}
        />
      </AdminDetailLayout>
    </AdminLayout>
  );
}
