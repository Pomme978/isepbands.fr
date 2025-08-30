'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/layouts/AdminLayout';

interface BadgeDefinition {
  id: number;
  key: string;
  labelFr: string;
  labelEn: string;
  description?: string;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BadgeFormData {
  key: string;
  labelFr: string;
  labelEn: string;
  description: string;
  color: string;
}

const BADGE_COLORS = [
  { value: '#FF6B35', name: 'Orange' },
  { value: '#4ECDC4', name: 'Teal' },
  { value: '#45B7D1', name: 'Blue' },
  { value: '#96CEB4', name: 'Green' },
  { value: '#FFEAA7', name: 'Yellow' },
  { value: '#DDA0DD', name: 'Purple' },
  { value: '#FFB6C1', name: 'Pink' },
  { value: '#D3D3D3', name: 'Silver' },
  { value: '#FF6347', name: 'Red' },
  { value: '#32CD32', name: 'Lime' },
];

function BadgesContent() {
  const [badges, setBadges] = useState<BadgeDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<BadgeFormData>({
    key: '',
    labelFr: '',
    labelEn: '',
    description: '',
    color: '#4ECDC4',
  });

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/badges', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setBadges(data.badges || []);
      } else {
        setError('Erreur lors du chargement des badges');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Error fetching badges:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      key: '',
      labelFr: '',
      labelEn: '',
      description: '',
      color: '#4ECDC4',
    });
    setEditingId(null);
    setIsCreating(false);
  };

  const startEdit = (badge: BadgeDefinition) => {
    setFormData({
      key: badge.key,
      labelFr: badge.labelFr,
      labelEn: badge.labelEn,
      description: badge.description || '',
      color: badge.color,
    });
    setEditingId(badge.id);
    setIsCreating(false);
  };

  const startCreate = () => {
    resetForm();
    setIsCreating(true);
  };

  const handleSave = async () => {
    try {
      const url = editingId ? `/api/admin/badges/${editingId}` : '/api/admin/badges';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchBadges();
        resetForm();
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Error saving badge:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce badge ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/badges/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        await fetchBadges();
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Error deleting badge:', err);
    }
  };

  const toggleActive = async (badge: BadgeDefinition) => {
    try {
      const response = await fetch(`/api/admin/badges/${badge.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          key: badge.key,
          labelFr: badge.labelFr,
          labelEn: badge.labelEn,
          description: badge.description,
          color: badge.color,
          isActive: !badge.isActive,
        }),
      });

      if (response.ok) {
        await fetchBadges();
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la modification');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Error toggling badge:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-gray-600">Chargement des badges...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Badges</h1>
          <p className="text-gray-600 mt-2">Gérez les badges disponibles pour les utilisateurs.</p>
        </div>
        <Button onClick={startCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouveau badge
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200">{error}</div>
      )}

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">
            {isCreating ? 'Nouveau badge' : 'Modifier le badge'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Clé unique *</label>
              <input
                type="text"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="founding_member"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
              <div className="flex gap-2">
                <select
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  {BADGE_COLORS.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.name}
                    </option>
                  ))}
                </select>
                <div
                  className="w-10 h-10 rounded-lg border border-gray-300"
                  style={{ backgroundColor: formData.color }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Label français *
              </label>
              <input
                type="text"
                value={formData.labelFr}
                onChange={(e) => setFormData({ ...formData, labelFr: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="Membre Fondateur"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Label anglais *
              </label>
              <input
                type="text"
                value={formData.labelEn}
                onChange={(e) => setFormData({ ...formData, labelEn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="Founding Member"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-vertical"
                rows={3}
                placeholder="Description du badge..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={resetForm}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>
      )}

      {/* Badges List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Badges existants ({badges.length})</h2>

          {badges.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun badge défini</p>
            </div>
          ) : (
            <div className="space-y-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 border rounded-lg ${
                    badge.isActive ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: badge.color }}
                      >
                        <Award className="w-4 h-4 text-white" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{badge.labelFr}</h3>
                          <span className="text-sm text-gray-500">({badge.labelEn})</span>
                          <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">
                            {badge.key}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              badge.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {badge.isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                        {badge.description && (
                          <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => toggleActive(badge)}>
                        {badge.isActive ? 'Désactiver' : 'Activer'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => startEdit(badge)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(badge.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

export default function BadgesPage() {
  return (
    <AdminLayout>
      <BadgesContent />
    </AdminLayout>
  );
}
