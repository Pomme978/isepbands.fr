'use client';

import { useState, useEffect } from 'react';
import { Share2, Plus, X, ExternalLink } from 'lucide-react';
import Loading from '@/components/ui/Loading';

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  isActive: boolean;
  sortOrder: number;
}

interface SocialTabProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function SocialTab({ onSuccess, onError }: SocialTabProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '' });

  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/social-links');
      if (response.ok) {
        const data = await response.json();
        setSocialLinks(data);
      }
    } catch (error) {
      console.error('Failed to load social links:', error);
      onError('Erreur lors du chargement des liens sociaux');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSocialLink = async () => {
    if (!newSocialLink.platform || !newSocialLink.url) {
      onError('La plateforme et l&apos;URL sont obligatoires');
      return;
    }

    try {
      const response = await fetch('/api/admin/social-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: newSocialLink.platform.toLowerCase(),
          url: newSocialLink.url,
          sortOrder: socialLinks.length,
        }),
      });

      if (response.ok) {
        const newLink = await response.json();
        setSocialLinks([...socialLinks, newLink]);
        setNewSocialLink({ platform: '', url: '' });
        onSuccess('Lien social ajouté avec succès');
      } else {
        const errorData = await response.json();
        onError(errorData.error || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Error creating social link:', error);
      onError('Erreur lors de la création du lien social');
    }
  };

  const handleUpdateSocialLink = async (id: number, updates: Partial<SocialLink>) => {
    try {
      const response = await fetch(`/api/admin/social-links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedLink = await response.json();
        setSocialLinks(socialLinks.map((link) => (link.id === id ? updatedLink : link)));
        onSuccess('Lien social mis à jour');
      } else {
        const errorData = await response.json();
        onError(errorData.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Error updating social link:', error);
      onError('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteSocialLink = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce lien social ?')) return;

    try {
      const response = await fetch(`/api/admin/social-links/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSocialLinks(socialLinks.filter((link) => link.id !== id));
        onSuccess('Lien social supprimé');
      } else {
        const errorData = await response.json();
        onError(errorData.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting social link:', error);
      onError('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loading text="Chargement des réseaux sociaux..." size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Share2 className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold">Réseaux sociaux</h2>
      </div>

      <div className="space-y-6">
        {/* Add new social link */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-4">Ajouter un réseau social</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Plateforme</label>
              <select
                value={newSocialLink.platform}
                onChange={(e) => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Sélectionner...</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter</option>
                <option value="x">X (Twitter)</option>
                <option value="tiktok">TikTok</option>
                <option value="discord">Discord</option>
                <option value="linkedin">LinkedIn</option>
                <option value="spotify">Spotify</option>
                <option value="soundcloud">SoundCloud</option>
                <option value="github">GitHub</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">URL</label>
              <input
                type="url"
                value={newSocialLink.url}
                onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleCreateSocialLink}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </button>
            </div>
          </div>
        </div>

        {/* Current social links */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Liens configurés</h3>
          {socialLinks.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
              <Share2 className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">Aucun réseau social configuré</p>
            </div>
          ) : (
            <div className="space-y-3">
              {socialLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Share2 className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{link.platform}</p>
                        <p className="text-sm text-gray-600">
                          {link.url.length > 50 ? `${link.url.substring(0, 50)}...` : link.url}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.open(link.url, '_blank')}
                      className="p-2 text-gray-600 hover:text-primary transition-colors"
                      title="Ouvrir le lien"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleUpdateSocialLink(link.id, { isActive: !link.isActive })}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        link.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {link.isActive ? 'Actif' : 'Inactif'}
                    </button>
                    <button
                      onClick={() => handleDeleteSocialLink(link.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <X className="w-4 h-4" />
                    </button>
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
