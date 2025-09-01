'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/layouts/AdminLayout';
import BadgeDisplay from '@/components/profile/BadgeDisplay';
import Loading from '@/components/ui/Loading';

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
  colorEnd: string;
  gradientDirection: string;
  textColor: 'white' | 'black';
  useGradient: boolean;
}

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
    colorEnd: '#FF6B35',
    gradientDirection: 'to right',
    textColor: 'white',
    useGradient: false,
  });

  // Fonction pour déterminer la couleur de texte optimale
  const getOptimalTextColor = (backgroundColor: string): 'white' | 'black' => {
    // Remove # if present
    const hex = backgroundColor.replace('#', '');

    // Parse RGB values
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate luminance using WCAG formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? 'black' : 'white';
  };

  // Mise à jour automatique de la couleur de texte quand la couleur de fond change
  const handleColorChange = (newColor: string) => {
    const optimalTextColor = getOptimalTextColor(newColor);
    setFormData({
      ...formData,
      color: newColor,
      textColor: optimalTextColor,
    });
  };

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
      colorEnd: '#FF6B35',
      gradientDirection: 'to right',
      textColor: 'white',
      useGradient: false,
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
      colorEnd: (badge as any).colorEnd || '#FF6B35',
      gradientDirection: (badge as any).gradientDirection || 'to right',
      textColor: (badge as any).textColor || getOptimalTextColor(badge.color),
      useGradient: !!(badge as any).colorEnd,
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
          textColor: getOptimalTextColor(badge.color), // Utilise la couleur de texte optimale
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
      <div className="py-12">
        <Loading text="Chargement des badges..." size="lg" />
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

            {/* Aperçu du badge */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Aperçu</label>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="inline-flex">
                  <span
                    className="inline-flex items-center px-5 py-3 rounded-full text-base font-medium shadow-sm transition-all duration-200"
                    style={{
                      background: formData.useGradient
                        ? `linear-gradient(${formData.gradientDirection}, ${formData.color}, ${formData.colorEnd})`
                        : formData.color,
                      color: formData.textColor,
                    }}
                  >
                    {formData.labelFr || 'Exemple Badge'}
                  </span>
                </div>
              </div>
            </div>

            {/* Choix du type de couleur */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">Apparence</label>
              <div className="space-y-4">
                {/* Radio buttons pour choisir couleur unie ou dégradé */}
                <div className="flex gap-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="colorType"
                      checked={!formData.useGradient}
                      onChange={() => setFormData({ ...formData, useGradient: false })}
                      className="mr-2 text-primary focus:ring-primary/20"
                    />
                    <span className="text-sm font-medium text-gray-700">Couleur unie</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="colorType"
                      checked={formData.useGradient}
                      onChange={() => setFormData({ ...formData, useGradient: true })}
                      className="mr-2 text-primary focus:ring-primary/20"
                    />
                    <span className="text-sm font-medium text-gray-700">Dégradé</span>
                  </label>
                </div>

                {/* Configuration couleur unie */}
                {!formData.useGradient && (
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Couleur du badge</h4>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-28 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono"
                        placeholder="#4ECDC4"
                        pattern="^#[0-9A-Fa-f]{6}$"
                      />
                    </div>
                  </div>
                )}

                {/* Configuration dégradé */}
                {formData.useGradient && (
                  <div className="p-4 bg-white rounded-lg border space-y-4">
                    <h4 className="text-sm font-medium text-gray-700">Configuration du dégradé</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Couleur de début
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={formData.color}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formData.color}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="flex-1 px-2 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono"
                            placeholder="#4ECDC4"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Couleur de fin
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={formData.colorEnd}
                            onChange={(e) => setFormData({ ...formData, colorEnd: e.target.value })}
                            className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formData.colorEnd}
                            onChange={(e) => setFormData({ ...formData, colorEnd: e.target.value })}
                            className="flex-1 px-2 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono"
                            placeholder="#FF6B35"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Direction du dégradé
                      </label>
                      <select
                        value={formData.gradientDirection}
                        onChange={(e) =>
                          setFormData({ ...formData, gradientDirection: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      >
                        <option value="to right">→ De gauche à droite</option>
                        <option value="to left">← De droite à gauche</option>
                        <option value="to bottom">↓ De haut en bas</option>
                        <option value="to top">↑ De bas en haut</option>
                        <option value="to bottom right">↘ Diagonal bas-droite</option>
                        <option value="to bottom left">↙ Diagonal bas-gauche</option>
                        <option value="to top right">↗ Diagonal haut-droite</option>
                        <option value="to top left">↖ Diagonal haut-gauche</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Couleur du texte */}
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Couleur du texte</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, textColor: 'white' })}
                        className={`px-4 py-2 text-sm rounded-lg border font-medium transition-colors ${
                          formData.textColor === 'white'
                            ? 'bg-gray-800 text-white border-gray-800'
                            : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        Blanc
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, textColor: 'black' })}
                        className={`px-4 py-2 text-sm rounded-lg border font-medium transition-colors ${
                          formData.textColor === 'black'
                            ? 'bg-gray-800 text-white border-gray-800'
                            : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        Noir
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      Suggéré:{' '}
                      <strong>
                        {getOptimalTextColor(formData.color) === 'white' ? 'Blanc' : 'Noir'}
                      </strong>
                    </span>
                  </div>
                </div>
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
                placeholder="Description interne du badge pour les administrateurs (à quoi sert ce badge, quand l'attribuer, etc.)"
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
