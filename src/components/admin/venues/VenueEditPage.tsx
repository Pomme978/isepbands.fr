'use client';

import { useState, useEffect } from 'react';
import {
  Save,
  MapPin,
  Building2,
  Calendar,
  FileText,
  AlertTriangle,
  Image,
  Trash2,
} from 'lucide-react';
import Loading from '@/components/ui/Loading';
import LangLink from '@/components/common/LangLink';
import BackButton from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import VenueEditMain from './edit-tabs/VenueEditMain';
import VenueEditAccess from './edit-tabs/VenueEditAccess';
import VenueEditEvents from './edit-tabs/VenueEditEvents';
import VenueEditNotes from './edit-tabs/VenueEditNotes';

interface VenueEditPageProps {
  venue: Venue;
  onVenueUpdate: (venue: Venue) => void;
}

interface Venue {
  id: string;
  name: string;
  description?: string;
  venueType:
    | 'CAMPUS'
    | 'CONCERT_HALL'
    | 'REHEARSAL_ROOM'
    | 'RECORDING_STUDIO'
    | 'BAR'
    | 'RESTAURANT'
    | 'NIGHTCLUB'
    | 'EXTERNAL'
    | 'OTHER';
  address: string;
  city: string;
  postalCode?: string;
  country: string;
  photoUrl?: string;
  metroLine?: string;
  accessInstructions?: string;
  staffNotes?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'AVOID';
  createdAt: string;
  eventsCount: number;
}

const TABS = [
  { id: 'main', label: 'Informations', icon: Building2 },
  { id: 'access', label: 'Accès & Localisation', icon: MapPin },
  { id: 'events', label: 'Historique des événements', icon: Calendar },
  { id: 'notes', label: 'Notes internes', icon: FileText },
];

const VENUE_TYPE_LABELS = {
  CAMPUS: 'Campus ISEP',
  CONCERT_HALL: 'Salle de concert',
  REHEARSAL_ROOM: 'Salle de répétition',
  RECORDING_STUDIO: "Studio d'enregistrement",
  BAR: 'Bar',
  RESTAURANT: 'Restaurant',
  NIGHTCLUB: 'Boîte de nuit',
  EXTERNAL: 'Lieu externe',
  OTHER: 'Autre',
};

export default function VenueEditPage({ venue: initialVenue, onVenueUpdate }: VenueEditPageProps) {
  const [activeTab, setActiveTab] = useState('main');
  const [venue, setVenue] = useState<Venue>(initialVenue);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setVenue(initialVenue);
    setHasUnsavedChanges(false);
  }, [initialVenue]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Mock save
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess('Lieu mis à jour avec succès');
      setHasUnsavedChanges(false);

      // Notifier le parent des changements sauvegardés
      onVenueUpdate(venue);

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const updateVenue = (updates: Partial<Venue>) => {
    const updatedVenue = { ...venue, ...updates };
    setVenue(updatedVenue);
    setHasUnsavedChanges(true);
    // Notifier le parent du changement (optionnel, pour temps réel)
    // onVenueUpdate(updatedVenue);
  };

  const handleDeleteVenue = async () => {
    if (!venue) return;

    try {
      setDeleting(true);
      // Mock deletion for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('Deleting venue:', venue.id);

      // Redirect to venues list after successful deletion
      window.location.href = '/admin/venues';
    } catch (error) {
      console.error('Error deleting venue:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete venue');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const isAvoidVenue = venue.status === 'AVOID';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <BackButton variant="ghost" />

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              {venue.photoUrl ? (
                <img
                  src={venue.photoUrl}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement
                      ?.querySelector('.fallback-icon')
                      ?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div
                className={`fallback-icon absolute inset-0 flex items-center justify-center ${venue.photoUrl ? 'hidden' : ''}`}
              >
                <Image className="w-6 h-6 text-gray-500" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{venue.name}</h1>
              <p className="text-gray-600">
                {VENUE_TYPE_LABELS[venue.venueType]} • {venue.city}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center px-4 py-2 text-sm bg-white border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Supprimer le lieu
          </button>

          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || saving}
            className={`inline-flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
              hasUnsavedChanges && !saving
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {saving ? (
              <Loading text="Sauvegarde..." size="sm" variant="spinner" theme="white" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors
                    ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'main' && <VenueEditMain venue={venue} onUpdate={updateVenue} />}

          {activeTab === 'access' && <VenueEditAccess venue={venue} onUpdate={updateVenue} />}

          {activeTab === 'events' && <VenueEditEvents venueId={venue.id} />}

          {activeTab === 'notes' && <VenueEditNotes venue={venue} onUpdate={updateVenue} />}
        </div>
      </div>

      {/* Status Badge Alert */}
      {isAvoidVenue && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800">Lieu marqué comme à éviter</h4>
              {venue.staffNotes && <p className="text-sm text-red-700 mt-1">{venue.staffNotes}</p>}
            </div>
          </div>
        </div>
      )}

      {venue.status === 'INACTIVE' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Lieu inactif</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Ce lieu n&apos;apparaît pas dans les options disponibles pour créer de nouveaux
                événements.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-700">{error}</div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-green-700">{success}</div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-4">
              Êtes-vous sûr de vouloir supprimer définitivement le lieu &quot;{venue.name}&quot; ?
              Cette action ne peut pas être annulée.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Annuler
              </Button>
              <Button
                onClick={handleDeleteVenue}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {deleting ? (
                  <Loading text="Suppression..." size="sm" variant="spinner" theme="white" />
                ) : (
                  <>
                    <Trash2 className="w-3 h-3 mr-1" />
                    Supprimer
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
