'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import {
  Calendar,
  Palette,
  Settings as SettingsIcon,
  FileText,
  Share2,
  Save,
  AlertTriangle,
} from 'lucide-react';
import Loading from '@/components/ui/Loading';
import AdminDetailLayout from '@/components/admin/common/AdminDetailLayout';
import YearTab from '@/components/admin/settings/tabs/YearTab';
import AppearanceTab from '@/components/admin/settings/tabs/AppearanceTab';
import SocialTab from '@/components/admin/settings/tabs/SocialTab';
import LegalTab from '@/components/admin/settings/tabs/LegalTab';

interface SystemSettings {
  currentYear: string;
  primaryColor: string;
}

interface LegalMentions {
  presidentName: string;
  contactEmail: string;
  technicalEmail: string;
  hostingProvider?: string;
  hostingAddress?: string;
  hostingPhone?: string;
  hostingEmail?: string;
  domainProvider?: string;
  domainAddress?: string;
  domainPhone?: string;
  developmentTeam?: string;
  designTeam?: string;
}

const TABS = [
  { id: 'year', label: 'Année scolaire', mobileLabel: 'Année', icon: Calendar },
  { id: 'appearance', label: 'Apparence', icon: Palette },
  { id: 'social', label: 'Réseaux sociaux', mobileLabel: 'Réseaux', icon: Share2 },
  { id: 'legal', label: 'Mentions légales', mobileLabel: 'Légal', icon: FileText },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    currentYear: new Date().getFullYear().toString(),
    primaryColor: '', // Will be loaded from CSS
  });

  const [legalMentions, setLegalMentions] = useState<LegalMentions>({
    presidentName: '',
    contactEmail: 'contact@isepbands.fr',
    technicalEmail: 'tech@isepbands.fr',
    hostingProvider: '',
    hostingAddress: '',
    hostingPhone: '',
    hostingEmail: '',
    domainProvider: '',
    domainAddress: '',
    domainPhone: '',
    developmentTeam: '',
    designTeam: '',
  });

  const [activeTab, setActiveTab] = useState('year');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasLegalChanges, setHasLegalChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  // Function to get current primary color from CSS
  const getCurrentPrimaryColor = (): string => {
    if (typeof window !== 'undefined') {
      const rootStyles = getComputedStyle(document.documentElement);
      const primaryColor = rootStyles.getPropertyValue('--primary').trim();
      return primaryColor || 'oklch(0.559 0.238 307.331)'; // fallback
    }
    return 'oklch(0.559 0.238 307.331)';
  };

  const loadSettings = async () => {
    try {
      setLoading(true);

      // Get current primary color from CSS
      const currentColor = getCurrentPrimaryColor();

      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings({
          ...data,
          primaryColor: data.primaryColor || currentColor, // Use API color or current CSS color
        });
      } else {
        // If API fails, at least load the current CSS color
        setSettings((prev) => ({
          ...prev,
          primaryColor: currentColor,
        }));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      // If everything fails, at least load the current CSS color
      setSettings((prev) => ({
        ...prev,
        primaryColor: getCurrentPrimaryColor(),
      }));
      setError('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  // Utility functions for messaging
  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  // Settings update handlers
  const updateSettings = (updates: Partial<SystemSettings>) => {
    setSettings((prev) => {
      // Vérifier s'il y a réellement des changements
      const hasActualChanges = Object.entries(updates).some(
        ([key, value]) => prev[key as keyof SystemSettings] !== value
      );
      
      if (hasActualChanges) {
        setHasUnsavedChanges(true);
      }
      
      return { ...prev, ...updates };
    });
  };

  const updateLegalMentions = (data: LegalMentions, isInitialLoad?: boolean) => {
    setLegalMentions((prev) => {
      // Si c'est un chargement initial, ne pas marquer comme modifié
      if (!isInitialLoad) {
        // Vérifier s'il y a réellement des changements
        const hasActualChanges = Object.entries(data).some(
          ([key, value]) => prev[key as keyof LegalMentions] !== value
        );
        
        if (hasActualChanges) {
          setHasLegalChanges(true);
        }
      }
      
      return data;
    });
  };

  // Year update handler for migration
  const updateYear = async (newYear: string) => {
    setSettings((prev) => {
      if (prev.currentYear !== newYear) {
        setHasUnsavedChanges(true);
      }
      return { ...prev, currentYear: newYear };
    });
  };

  // Save all changes
  const handleSaveAll = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const promises = [];

      // Save system settings if there are changes
      if (hasUnsavedChanges) {
        promises.push(
          fetch('/api/admin/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings),
          }),
        );
      }

      // Save legal mentions if there are changes
      if (hasLegalChanges) {
        promises.push(
          fetch('/api/admin/legal-mentions', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(legalMentions),
          }),
        );
      }

      const responses = await Promise.all(promises);

      // Check if all requests succeeded
      for (const response of responses) {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
        }
      }

      setHasUnsavedChanges(false);
      setHasLegalChanges(false);
      setSuccess('Tous les paramètres ont été sauvegardés avec succès');

      // Apply primary color change and reload page if color changed
      if (activeTab === 'appearance') {
        const currentCssColor = getCurrentPrimaryColor();
        if (currentCssColor !== settings.primaryColor) {
          // Apply the new color immediately
          document.documentElement.style.setProperty('--primary', settings.primaryColor);

          // Show success message briefly, then reload
          setTimeout(() => {
            setSuccess('Couleur appliquée ! Actualisation de la page...');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }, 500);
        } else {
          setTimeout(() => setSuccess(null), 3000);
        }
      } else {
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'year':
        return <YearTab currentYear={settings.currentYear} onSave={updateYear} saving={saving} />;
      case 'appearance':
        return (
          <AppearanceTab
            primaryColor={settings.primaryColor}
            onColorChange={(color) => updateSettings({ primaryColor: color })}
          />
        );
      case 'social':
        return <SocialTab onSuccess={showSuccess} onError={showError} />;
      case 'legal':
        return <LegalTab onDataChange={updateLegalMentions} onError={showError} />;
      default:
        return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loading text="Chargement des paramètres..." size="lg" />
        </div>
      </AdminLayout>
    );
  }

  // Warning banners
  const warningBanners = [];
  if (error) {
    warningBanners.push(
      <div key="error" className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    warningBanners.push(
      <div key="success" className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="w-5 h-5 bg-green-400 rounded-full mr-3 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          <p className="text-sm text-green-800">{success}</p>
        </div>
      </div>
    );
  }

  // Primary actions
  const primaryActions = [{
    label: 'Sauvegarder les changements',
    mobileLabel: 'Sauvegarder',
    icon: Save,
    onClick: handleSaveAll,
    variant: (hasUnsavedChanges || hasLegalChanges ? 'primary' : 'secondary') as const,
    disabled: !hasUnsavedChanges && !hasLegalChanges,
    loading: saving,
    loadingText: 'Sauvegarde...',
  }];

  return (
    <AdminLayout>
      <AdminDetailLayout
        backHref="/admin"
        backLabel="Back to Dashboard"
        backMobileLabel="Dashboard"
        itemInfo={{
          title: "Paramètres système",
          subtitle: "Configuration générale du site et de l'association",
        }}
        warningBanners={warningBanners}
        primaryActions={primaryActions}
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasUnsavedChanges={hasUnsavedChanges || hasLegalChanges}
        unsavedChangesLabel="Vous avez des modifications non sauvegardées"
      >
        {renderTabContent()}
      </AdminDetailLayout>
    </AdminLayout>
  );
}
