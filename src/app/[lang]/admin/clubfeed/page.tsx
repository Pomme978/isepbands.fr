'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import AdminDetailLayout from '@/components/admin/common/AdminDetailLayout';
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
import ArchiveConfirmModal from '@/components/admin/common/ArchiveConfirmModal';
import type { ActivityType } from '@/types/activity';
import { AdminRecentActivity } from '@/components/admin/AdminRecentActivity';
import type { PublicFeedType } from '@/types/publicFeed';

interface ActivityItem {
  id: string;
  type: 'user_joined' | 'group_created' | 'event_created' | 'achievement' | 'custom';
  title: string;
  description?: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  userRole?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  createdBy?: string;
}

export default function AdminClubFeedPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [displayActivities, setDisplayActivities] = useState<ActivityType[]>([]);
  const [publicFeedItems, setPublicFeedItems] = useState<PublicFeedType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPublicFeed, setIsLoadingPublicFeed] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; isFullAccess?: boolean } | null>(
    null,
  );
  const [archiveModal, setArchiveModal] = useState<{
    isOpen: boolean;
    activityId: string;
    activityTitle: string;
  }>({
    isOpen: false,
    activityId: '',
    activityTitle: '',
  });

  // Form state
  const [newActivity, setNewActivity] = useState({
    type: 'custom' as const,
    title: '',
    description: '',
  });

  useEffect(() => {
    fetchActivities();
    fetchCurrentUser();
    fetchPublicFeed();
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

  const fetchPublicFeed = async () => {
    try {
      setIsLoadingPublicFeed(true);
      const response = await fetch('/api/clubfeed?t=' + Date.now());
      if (response.ok) {
        const data = await response.json();
        const transformedActivities: (PublicFeedType & { createdBy?: string })[] =
          data.activities?.map(
            (activity: {
              id: string;
              type: string;
              createdAt: string;
              title: string;
              description?: string;
              userName?: string;
              userAvatar?: string;
              userRole?: string;
              userRoleColors?: {
                gradientStart: string;
                gradientEnd: string;
              };
              createdBy?: string;
            }) => ({
              id: activity.id,
              type: activity.type === 'custom' ? 'post' : (activity.type as PublicFeedType['type']),
              timestamp: new Date(activity.createdAt),
              title: activity.title,
              description: activity.description || '',
              user: {
                name: activity.userName || 'Utilisateur',
                avatar: activity.userAvatar || '/avatars/default.jpg',
                role: activity.userRole || undefined,
                roleColors: activity.userRoleColors || undefined,
              },
              createdBy: activity.createdBy,
            }),
          ) || [];
        setPublicFeedItems(transformedActivities);
      } else {
        console.warn('Failed to fetch public feed');
        setPublicFeedItems([]);
      }
    } catch (error) {
      console.error('Error fetching public feed:', error);
      setPublicFeedItems([]);
    } finally {
      setIsLoadingPublicFeed(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/activity-logs');
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);

        // Transform to ActivityType format
        const transformedActivities: ActivityType[] = (data.activities || []).map(
          (activity: ActivityItem) =>
            ({
              id: activity.id,
              type:
                activity.type === 'custom'
                  ? 'post'
                  : activity.type === 'user_joined'
                    ? 'new_member'
                    : activity.type === 'group_created'
                      ? 'new_group'
                      : activity.type === 'event_created'
                        ? 'event'
                        : 'post',
              timestamp: new Date(activity.createdAt),
              title: activity.title,
              description: activity.description || '',
              user: activity.userName
                ? {
                    name: activity.userName,
                    avatar: activity.userAvatar || '/avatars/default.jpg',
                    role: activity.userRole || null,
                  }
                : undefined,
              isSystemMessage: activity.type !== 'custom',
              createdBy: activity.createdBy,
            }) as ActivityType & { createdBy?: string },
        );

        setDisplayActivities(transformedActivities);
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
      const response = await fetch('/api/admin/activity-logs', {
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
      console.log('Publication créée avec succès:', data.activity);
      setActivities([data.activity, ...activities]);

      // Update display activities too
      const newDisplayActivity: ActivityType & { createdBy?: string } = {
        id: data.activity.id,
        type: 'post',
        timestamp: new Date(data.activity.createdAt),
        title: data.activity.title,
        description: data.activity.description || '',
        user: data.activity.userName
          ? {
              name: data.activity.userName,
              avatar: data.activity.userAvatar || '/avatars/default.jpg',
              role: data.activity.userRole || null,
            }
          : undefined,
        isSystemMessage: false,
        createdBy: data.activity.createdBy,
      };
      console.log('Nouvelle activité ajoutée localement:', newDisplayActivity);
      setDisplayActivities([newDisplayActivity, ...displayActivities]);

      // Reset form
      setNewActivity({ type: 'custom', title: '', description: '' });
      setShowCreateForm(false);

      // Refresh public feed to show the new post
      console.log('Rafraîchissement du feed public...');
      fetchPublicFeed();

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
      console.log('Editing activity:', editingActivity.id, 'Data:', {
        title: editingActivity.title,
        description: editingActivity.description,
      });

      const response = await fetch(`/api/admin/activity-logs/${editingActivity.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingActivity.title,
          description: editingActivity.description,
        }),
      });

      console.log('Edit response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Edit error:', errorData);
        throw new Error(errorData.error || 'Failed to update activity');
      }

      const data = await response.json();
      setActivities(activities.map((a) => (a.id === editingActivity.id ? data.activity : a)));

      // Update display activities too
      const updatedDisplayActivity: ActivityType & { createdBy?: string } = {
        id: data.activity.id,
        type: 'post',
        timestamp: new Date(data.activity.createdAt),
        title: data.activity.title,
        description: data.activity.description || '',
        user: data.activity.userName
          ? {
              name: data.activity.userName,
              avatar: data.activity.userAvatar || '/avatars/default.jpg',
              role: data.activity.userRole || null,
            }
          : undefined,
        isSystemMessage: false,
        createdBy: data.activity.createdBy,
      };
      setDisplayActivities(
        displayActivities.map((a) => (a.id === editingActivity.id ? updatedDisplayActivity : a)),
      );

      // Reset editing state
      setEditingActivity(null);

      // Update public feed items if this post exists there
      const updatedPublicFeedItems = publicFeedItems.map((item) => {
        if (item.id === editingActivity.id) {
          return {
            ...item,
            title: data.activity.title,
            description: data.activity.description || '',
          };
        }
        return item;
      });
      setPublicFeedItems(updatedPublicFeedItems);

      // Also refresh from API to be sure
      console.log('Refreshing public feed after edit...');
      fetchPublicFeed();

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
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement cette publication ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/clubfeed/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from all lists
        setActivities(activities.filter((a) => a.id !== id));
        setDisplayActivities(displayActivities.filter((a) => a.id !== id));
        setPublicFeedItems(publicFeedItems.filter((a) => a.id !== id));

        // Show success message
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setSaveError(errorData.error || 'Erreur lors de la suppression');
        setTimeout(() => setSaveError(null), 5000);
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      setSaveError('Erreur lors de la suppression');
      setTimeout(() => setSaveError(null), 5000);
    }
  };

  const handleArchiveActivity = (id: string) => {
    const activity = publicFeedItems.find((a) => a.id === id);
    if (activity) {
      setArchiveModal({
        isOpen: true,
        activityId: id,
        activityTitle: activity.title || 'Post sans titre',
      });
    }
  };

  const confirmArchiveActivity = async (reason?: string) => {
    try {
      const response = await fetch(`/api/admin/posts/${archiveModal.activityId}/archive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: reason || 'Archivé par un administrateur' }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Remove from current list
        setActivities(activities.filter((a) => a.id !== archiveModal.activityId));
        setDisplayActivities(displayActivities.filter((a) => a.id !== archiveModal.activityId));
        setPublicFeedItems(publicFeedItems.filter((a) => a.id !== archiveModal.activityId));

        // Show success message
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);

        // Close modal
        closeArchiveModal();
      } else {
        // Handle API error response
        const errorMessage = data.error || "Erreur lors de l'archivage";
        console.error('API Error:', errorMessage);
        setSaveError(errorMessage);
        setTimeout(() => setSaveError(null), 5000);
        closeArchiveModal();
      }
    } catch (error) {
      console.error('Network error archiving activity:', error);
      setSaveError("Erreur réseau lors de l'archivage");
      setTimeout(() => setSaveError(null), 5000);
      closeArchiveModal();
    }
  };

  const closeArchiveModal = () => {
    setArchiveModal({
      isOpen: false,
      activityId: '',
      activityTitle: '',
    });
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
      <div className="space-y-6">
        {/* Toast notifications */}
        {saveSuccess && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
            <Alert className="bg-green-50 border-green-200 max-w-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-base md:text-sm text-green-800 ml-2">
                Opération réussie
              </AlertDescription>
            </Alert>
          </div>
        )}
        {saveError && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
            <Alert className="bg-red-50 border-red-200 max-w-sm">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-base md:text-sm text-red-800 ml-2">
                {saveError}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Club Feed</h1>
            <p className="text-gray-600 mt-2">
              Publiez des actualités qui apparaîtront sur la page d&apos;accueil des membres
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Publier une actualité
          </Button>
        </div>

        {/* Create Activity Form */}
        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>Publier une actualité</CardTitle>
              <CardDescription className="text-base md:text-sm">
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
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleCreateActivity}
                  disabled={isSaving || !newActivity.title.trim()}
                  className="w-full sm:w-auto"
                >
                  {isSaving ? (
                    <Loading text="Publication..." size="sm" variant="spinner" theme="white" />
                  ) : (
                    'Publier'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewActivity({ type: 'custom', title: '', description: '' });
                  }}
                  className="w-full sm:w-auto"
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Activity Form */}
        {editingActivity && (
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle>Modifier l&apos;actualité</CardTitle>
              <CardDescription className="text-base md:text-sm">
                Modifiez votre actualité
              </CardDescription>
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
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleEditActivity}
                  disabled={isSaving || !editingActivity.title.trim()}
                  className="w-full sm:w-auto"
                >
                  {isSaving ? (
                    <Loading text="Sauvegarde..." size="sm" variant="spinner" theme="white" />
                  ) : (
                    'Sauvegarder'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingActivity(null)}
                  className="w-full sm:w-auto"
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Public Feed Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Feed Public (Aperçu)</CardTitle>
            <CardDescription className="text-base">
              Ce que voient les membres sur leur page d&apos;accueil
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingPublicFeed ? (
              <div className="flex items-center justify-center py-8">
                <Loading text="Chargement du feed public..." size="sm" />
              </div>
            ) : (
              <AdminRecentActivity
                activities={publicFeedItems}
                maxItems={6}
                currentUser={currentUser}
                onEdit={(activity) => setEditingActivity(activity)}
                onArchive={(activityId) => handleArchiveActivity(activityId)}
                onDelete={(activityId) => handleDeleteActivity(activityId)}
                rawActivities={publicFeedItems}
              />
            )}
          </CardContent>
        </Card>

        {/* Archive Confirmation Modal */}
        <ArchiveConfirmModal
          isOpen={archiveModal.isOpen}
          onClose={closeArchiveModal}
          onConfirm={confirmArchiveActivity}
          title="Archiver la publication"
          description="Cette publication sera déplacée vers les archives et ne sera plus visible sur la page d'accueil ni dans le feed du club. Elle pourra être restaurée depuis la page Archives."
          itemName={archiveModal.activityTitle}
        />
      </div>
    </AdminLayout>
  );
}
