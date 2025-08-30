'use client';

import { useState, useEffect } from 'react';
import { Upload, Save, Image as ImageIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/layouts/AdminLayout';

interface TeamSettings {
  vision: string;
  groupPhotoUrl?: string;
}

function BoardTeamContent() {
  const [settings, setSettings] = useState<TeamSettings>({
    vision: `🎵 Rassembler les passionnés de musique
🎸 Créer des expériences musicales inoubliables
🤝 Renforcer les liens entre les étudiants
🎯 Développer les talents artistiques
🌟 Faire rayonner l'ISEP par la musique`,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamSettings();
  }, []);

  const fetchTeamSettings = async () => {
    try {
      const response = await fetch('/api/admin/team/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        if (data.groupPhotoUrl) {
          setPhotoPreview(data.groupPhotoUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching team settings:', error);
    }
  };

  const handleVisionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSettings((prev) => ({
      ...prev,
      vision: e.target.value,
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner une image valide' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: "L'image ne doit pas dépasser 5MB" });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/team/upload-photo', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSettings((prev) => ({
          ...prev,
          groupPhotoUrl: data.url,
        }));
        setPhotoPreview(data.url);
        setMessage({ type: 'success', text: 'Photo uploadée avec succès' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || "Erreur lors de l'upload" });
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setMessage({ type: 'error', text: "Erreur lors de l'upload de la photo" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/team/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Paramètres sauvegardés avec succès' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Erreur lors de la sauvegarde' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Board Team</h1>
        <p className="text-gray-600 mt-2">
          Gérez la vision de l&apos;équipe et la photo de groupe affichée sur la page team.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vision Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900">Notre Vision</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texte de la vision (affiché sur la page team)
              </label>
              <textarea
                value={settings.vision}
                onChange={handleVisionChange}
                rows={8}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-vertical"
                placeholder="Entrez la vision de l'équipe..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Utilisez des emojis et des retours à la ligne pour structurer le texte.
              </p>
            </div>
          </div>
        </div>

        {/* Group Photo Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900">Photo de Groupe</h2>
          </div>

          <div className="space-y-4">
            {/* Current Photo Preview */}
            {photoPreview && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Photo actuelle :</p>
                <div className="relative w-full h-48 border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={photoPreview}
                    alt="Photo de groupe actuelle"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouvelle photo de groupe
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                  disabled={loading}
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Cliquez pour uploader une nouvelle photo</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG jusqu&apos;à 5MB</p>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          {loading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
        </Button>
      </div>
    </div>
  );
}

export default function BoardTeamPage() {
  return (
    <AdminLayout>
      <BoardTeamContent />
    </AdminLayout>
  );
}
