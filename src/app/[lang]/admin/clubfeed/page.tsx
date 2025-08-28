'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Activity,
  Plus,
  Trash2,
  Edit,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import Loading from '@/components/ui/Loading';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ActivityItem {
  id: string;
  type: 'user_joined' | 'group_created' | 'event_created' | 'achievement' | 'custom';
  title: string;
  description?: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  createdBy?: string;
}

export default function AdminClubFeedPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);

  // Form state
  const [newActivity, setNewActivity] = useState({
    type: 'custom' as const,
    title: '',
    description: '',
  });

  useEffect(() => {
    fetchActivities();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/clubfeed');
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateActivity = async () => {
    if (!newActivity.title.trim()) {
      setSaveError('Le titre est requis');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch('/api/admin/clubfeed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newActivity),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to create activity:', errorData);
        throw new Error(errorData.error || 'Failed to create activity');
      }

      const data = await response.json();
      setActivities([data.activity, ...activities]);

      // Reset form
      setNewActivity({ type: 'custom', title: '', description: '' });
      setShowCreateForm(false);

      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error creating activity:', error);
      setSaveError(
        error instanceof Error ? error.message : "Erreur lors de la création de l'activité",
      );
      setTimeout(() => setSaveError(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditActivity = async () => {
    if (!editingActivity || !editingActivity.title.trim()) {
      setSaveError('Le titre est requis');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch(`/api/admin/clubfeed/${editingActivity.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingActivity.title,
          description: editingActivity.description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update activity');
      }

      const data = await response.json();
      setActivities(activities.map((a) => (a.id === editingActivity.id ? data.activity : a)));

      // Reset editing state
      setEditingActivity(null);

      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating activity:', error);
      setSaveError('Erreur lors de la modification');
      setTimeout(() => setSaveError(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/clubfeed/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setActivities(activities.filter((a) => a.id !== id));
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_joined':
        return <User className="h-4 w-4" />;
      case 'group_created':
        return <Activity className="h-4 w-4" />;
      case 'event_created':
        return <Calendar className="h-4 w-4" />;
      case 'achievement':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_joined':
        return 'text-blue-600 bg-blue-50';
      case 'group_created':
        return 'text-purple-600 bg-purple-50';
      case 'event_created':
        return 'text-green-600 bg-green-50';
      case 'achievement':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Don't show full page loading, handle it in the content area

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        {/* Toast notifications */}
        {saveSuccess && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
            <Alert className="bg-green-50 border-green-200 max-w-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 ml-2">
                Activité créée avec succès
              </AlertDescription>
            </Alert>
          </div>
        )}
        {saveError && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
            <Alert className="bg-red-50 border-red-200 max-w-sm">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 ml-2">{saveError}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Club Feed</h1>
            <p className="text-muted-foreground mt-2">
              Publiez des actualités qui apparaîtront sur la page d&apos;accueil des membres
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Publier une actualité
          </Button>
        </div>

        {/* Create Activity Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Publier une actualité</CardTitle>
              <CardDescription>
                Cette actualité apparaîtra dans le feed de la page d&apos;accueil des membres
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Nouveau concert annoncé"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description (optionnelle)</Label>
                <Textarea
                  id="description"
                  placeholder="Détails supplémentaires..."
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateActivity}
                  disabled={isSaving || !newActivity.title.trim()}
                >
                  {isSaving ? <Loading text="" size="sm" /> : 'Publier'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewActivity({ type: 'custom', title: '', description: '' });
                  }}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Activity Form */}
        {editingActivity && (
          <Card className="mb-6 border-orange-200">
            <CardHeader>
              <CardTitle>Modifier l&apos;actualité</CardTitle>
              <CardDescription>Modifiez votre actualité</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Titre *</Label>
                <Input
                  id="edit-title"
                  placeholder="Ex: Nouveau concert annoncé"
                  value={editingActivity.title}
                  onChange={(e) =>
                    setEditingActivity({ ...editingActivity, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description (optionnelle)</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Détails supplémentaires..."
                  value={editingActivity.description || ''}
                  onChange={(e) =>
                    setEditingActivity({ ...editingActivity, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleEditActivity}
                  disabled={isSaving || !editingActivity.title.trim()}
                >
                  {isSaving ? <Loading text="" size="sm" /> : 'Sauvegarder'}
                </Button>
                <Button variant="outline" onClick={() => setEditingActivity(null)}>
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activities List */}
        <Card>
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
            <CardDescription>Les 50 dernières activités du club</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loading text="Chargement des activités..." size="sm" />
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune activité pour le moment
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    {/* Icon */}
                    <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{activity.title}</p>
                        {activity.type === 'custom' && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            Manuel
                          </span>
                        )}
                      </div>
                      {activity.description && (
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(activity.createdAt), 'dd MMM yyyy à HH:mm', {
                            locale: fr,
                          })}
                        </span>
                        {activity.userName && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {activity.userName}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {activity.type === 'custom' && currentUser && (
                      <div className="flex gap-2">
                        {/* Edit button - only for creator */}
                        {activity.createdBy === currentUser.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingActivity(activity)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Delete button - for all admins */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteActivity(activity.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
