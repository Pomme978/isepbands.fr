'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import {
  Calendar,
  Palette,
  Building2,
  AlertTriangle,
  Save,
  RefreshCw,
  Settings as SettingsIcon,
  FileText,
  Share2,
  Plus,
  X,
  ExternalLink,
  Move,
} from 'lucide-react';
import Loading from '@/components/ui/Loading';

interface SystemSettings {
  currentYear: string;
  primaryColor: string;
  association: {
    name: string;
    legalStatus: string;
    address: string;
    siret?: string;
    email: string;
  };
  publicationDirector: {
    name: string;
  };
}

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  isActive: boolean;
  sortOrder: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    currentYear: new Date().getFullYear().toString(),
    primaryColor: 'oklch(0.559 0.238 307.331)', // Default purple from CSS
    association: {
      name: 'ISEP Bands',
      legalStatus: 'Association loi 1901',
      address: '',
      siret: '',
      email: 'contact@isepbands.fr',
    },
    publicationDirector: {
      name: '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeSection, setActiveSection] = useState('year');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Social Links state
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [socialLinksLoading, setSocialLinksLoading] = useState(false);
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '' });

  // Check if current month is August (migration allowed)
  const isAugust = new Date().getMonth() === 7;

  useEffect(() => {
    loadSettings();
    loadSocialLinks();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      setError('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const loadSocialLinks = async () => {
    try {
      setSocialLinksLoading(true);
      const response = await fetch('/api/admin/social-links');
      if (response.ok) {
        const data = await response.json();
        setSocialLinks(data);
      }
    } catch (error) {
      console.error('Failed to load social links:', error);
      setError('Erreur lors du chargement des liens sociaux');
    } finally {
      setSocialLinksLoading(false);
    }
  };

  const handleCreateSocialLink = async () => {
    if (!newSocialLink.platform || !newSocialLink.url) {
      setError('La plateforme et l\'URL sont obligatoires');
      return;
    }

    try {
      const response = await fetch('/api/admin/social-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: newSocialLink.platform.toLowerCase(),
          url: newSocialLink.url,
          sortOrder: socialLinks.length
        })
      });

      if (response.ok) {
        const newLink = await response.json();
        setSocialLinks([...socialLinks, newLink]);
        setNewSocialLink({ platform: '', url: '' });
        setSuccess('Lien social ajouté avec succès');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Error creating social link:', error);
      setError('Erreur lors de la création du lien social');
    }
  };

  const handleUpdateSocialLink = async (id: number, updates: Partial<SocialLink>) => {
    try {
      const response = await fetch(`/api/admin/social-links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const updatedLink = await response.json();
        setSocialLinks(socialLinks.map(link => 
          link.id === id ? updatedLink : link
        ));
        setSuccess('Lien social mis à jour');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Error updating social link:', error);
      setError('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteSocialLink = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce lien social ?')) return;

    try {
      const response = await fetch(`/api/admin/social-links/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSocialLinks(socialLinks.filter(link => link.id !== id));
        setSuccess('Lien social supprimé');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting social link:', error);
      setError('Erreur lors de la suppression');
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }

      setHasUnsavedChanges(false);
      setSuccess('Paramètres sauvegardés avec succès');

      // Apply primary color change
      if (activeSection === 'appearance') {
        document.documentElement.style.setProperty('--primary', settings.primaryColor);
      }

      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleMigrateYear = async () => {
    if (!isAugust) {
      setError('La migration d&apos;année n&apos;est possible qu&apos;en août');
      return;
    }

    const confirmed = confirm(
      `Êtes-vous sûr de vouloir migrer vers l&apos;année ${parseInt(settings.currentYear) + 1} ? ` +
        'Cette action archivera les données de l&apos;année en cours et créera une nouvelle année scolaire.',
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      const response = await fetch('/api/admin/settings/migrate-year', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la migration');
      }

      const newYear = (parseInt(settings.currentYear) + 1).toString();
      setSettings((prev) => ({ ...prev, currentYear: newYear }));
      setSuccess(`Migration vers l&apos;année ${newYear} réussie`);
    } catch (error) {
      console.error('Failed to migrate year:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la migration');
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (updates: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const updateAssociation = (updates: Partial<SystemSettings['association']>) => {
    setSettings((prev) => ({
      ...prev,
      association: { ...prev.association, ...updates },
    }));
    setHasUnsavedChanges(true);
  };

  const updatePublicationDirector = (updates: Partial<SystemSettings['publicationDirector']>) => {
    setSettings((prev) => ({
      ...prev,
      publicationDirector: { ...prev.publicationDirector, ...updates },
    }));
    setHasUnsavedChanges(true);
  };

  const predefinedColors = [
    { name: 'Violet (défaut)', value: 'oklch(0.559 0.238 307.331)' },
    { name: 'Bleu', value: 'oklch(0.559 0.238 230)' },
    { name: 'Vert', value: 'oklch(0.559 0.238 142)' },
    { name: 'Rouge', value: 'oklch(0.559 0.238 27)' },
    { name: 'Orange', value: 'oklch(0.559 0.238 50)' },
    { name: 'Rose', value: 'oklch(0.559 0.238 330)' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-12">
          <Loading text="Chargement des paramètres..." size="lg" />
        </div>
      </AdminLayout>
    );
  }

  const sections = [
    { id: 'year', label: 'Année scolaire', icon: Calendar },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'social', label: 'Réseaux sociaux', icon: Share2 },
    { id: 'legal', label: 'Mentions légales', icon: FileText },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center space-x-3">
            <SettingsIcon className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Paramètres système</h1>
              <p className="mt-1 text-base md:text-sm text-muted-foreground">
                Configuration générale du site et de l&apos;association
              </p>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
              <p className="text-base md:text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-green-400 rounded-full mr-3 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <p className="text-base md:text-sm text-green-800">{success}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-border rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-4">Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="text-base md:text-sm font-medium">{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-border rounded-lg">
              {/* Year Management Section */}
              {activeSection === 'year' && (
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Calendar className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold">Gestion de l&apos;année scolaire</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Année scolaire en cours
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="text"
                          value={settings.currentYear}
                          readOnly
                          className="w-32 px-3 py-2 border border-input rounded-md bg-muted text-foreground"
                        />
                        <span className="text-sm text-muted-foreground">
                          {settings.currentYear}-{parseInt(settings.currentYear) + 1}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <div className="flex items-start space-x-4">
                        <AlertTriangle
                          className={`w-5 h-5 mt-0.5 ${isAugust ? 'text-green-600' : 'text-amber-600'}`}
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground mb-2">
                            Migration vers l&apos;année suivante
                          </h3>
                          {isAugust ? (
                            <div>
                              <p className="text-sm text-green-700 mb-4">
                                ✅ Migration disponible (nous sommes en août)
                              </p>
                              <button
                                onClick={handleMigrateYear}
                                disabled={saving}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                              >
                                {saving ? (
                                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <Calendar className="w-4 h-4 mr-2" />
                                )}
                                Migrer vers {parseInt(settings.currentYear) + 1}
                              </button>
                            </div>
                          ) : (
                            <p className="text-sm text-amber-700">
                              ⚠️ La migration n&apos;est possible qu&apos;en août. Cette action
                              archivera l&apos;année en cours et créera une nouvelle année scolaire.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Section */}
              {activeSection === 'appearance' && (
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Palette className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold">Apparence du site</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Couleur principale
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {predefinedColors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => updateSettings({ primaryColor: color.value })}
                            className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                              settings.primaryColor === color.value
                                ? 'border-foreground bg-muted'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div
                              className="w-8 h-8 rounded-full mx-auto mb-2"
                              style={{
                                backgroundColor: `oklch(${color.value.split('(')[1].split(')')[0]})`,
                              }}
                            />
                            <span className="text-xs font-medium text-foreground">
                              {color.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Couleur personnalisée (OKLCH)
                      </label>
                      <input
                        type="text"
                        value={settings.primaryColor}
                        onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                        placeholder="oklch(0.559 0.238 307.331)"
                        className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Format: oklch(lightness chroma hue). Exemple: oklch(0.559 0.238 307.331)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Media Section */}
              {activeSection === 'social' && (
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Share2 className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold">Réseaux sociaux</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Add new social link */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <h3 className="font-medium text-foreground mb-4">Ajouter un réseau social</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Plateforme
                          </label>
                          <select
                            value={newSocialLink.platform}
                            onChange={(e) => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
                            className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                          <label className="block text-sm font-medium text-foreground mb-2">
                            URL
                          </label>
                          <input
                            type="url"
                            value={newSocialLink.url}
                            onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={handleCreateSocialLink}
                            className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Current social links */}
                    <div>
                      <h3 className="font-medium text-foreground mb-4">Liens configurés</h3>
                      {socialLinksLoading ? (
                        <div className="text-center py-8">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Chargement...</p>
                        </div>
                      ) : socialLinks.length === 0 ? (
                        <div className="text-center py-8 border border-dashed border-border rounded-lg">
                          <Share2 className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Aucun réseau social configuré</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {socialLinks.map((link) => (
                            <div
                              key={link.id}
                              className="flex items-center justify-between p-4 border border-border rounded-lg bg-white"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Share2 className="w-4 h-4 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-foreground capitalize">
                                      {link.platform}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {link.url.length > 50 ? `${link.url.substring(0, 50)}...` : link.url}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => window.open(link.url, '_blank')}
                                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
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
                                  className="p-2 text-muted-foreground hover:text-red-600 transition-colors"
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
              )}

              {/* Legal Mentions Section */}
              {activeSection === 'legal' && (
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <FileText className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold">Mentions légales</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Association Identity */}
                    <div>
                      <h3 className="font-medium text-foreground mb-4 flex items-center">
                        <Building2 className="w-5 h-5 mr-2 text-primary" />
                        Identité de l&apos;association
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Nom officiel *
                          </label>
                          <input
                            type="text"
                            value={settings.association.name}
                            onChange={(e) => updateAssociation({ name: e.target.value })}
                            className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Statut juridique *
                          </label>
                          <select
                            value={settings.association.legalStatus}
                            onChange={(e) => updateAssociation({ legalStatus: e.target.value })}
                            className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          >
                            <option value="Association loi 1901">Association loi 1901</option>
                            <option value="Association loi 1908">
                              Association loi 1908 (Alsace-Moselle)
                            </option>
                            <option value="Autre">Autre</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Adresse du siège social *
                          </label>
                          <textarea
                            value={settings.association.address}
                            onChange={(e) => updateAssociation({ address: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder="Adresse complète du siège social..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Numéro SIRET
                          </label>
                          <input
                            type="text"
                            value={settings.association.siret || ''}
                            onChange={(e) => updateAssociation({ siret: e.target.value })}
                            placeholder="Si activités économiques"
                            className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Email de contact *
                          </label>
                          <input
                            type="email"
                            value={settings.association.email}
                            onChange={(e) => updateAssociation({ email: e.target.value })}
                            className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Publication Director */}
                    <div className="border-t pt-6">
                      <h3 className="font-medium text-foreground mb-4">
                        Responsable de publication
                      </h3>
                      <div className="max-w-md">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Nom du responsable *
                        </label>
                        <input
                          type="text"
                          value={settings.publicationDirector.name}
                          onChange={(e) => updatePublicationDirector({ name: e.target.value })}
                          placeholder="Président ou responsable désigné"
                          className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Généralement le président de l&apos;association
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="border-t border-border px-6 py-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {hasUnsavedChanges && (
                      <div className="flex items-center space-x-2 text-amber-600">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">Modifications non sauvegardées</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    disabled={saving || !hasUnsavedChanges}
                    className={`inline-flex items-center px-4 py-2 rounded-md transition-colors ${
                      hasUnsavedChanges && !saving
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    {saving ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
