'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Train, MapPin, Navigation, Info } from 'lucide-react';

interface Venue {
  id: string;
  metroLine?: string;
  accessInstructions?: string;
  address: string;
  city: string;
  postalCode?: string;
}

interface VenueEditAccessProps {
  venue: Venue;
  onUpdate: (updates: Partial<Venue>) => void;
}

export default function VenueEditAccess({ venue, onUpdate }: VenueEditAccessProps) {
  return (
    <div className="space-y-6">
      {/* Transport */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Train className="w-5 h-5" />
          Transports en commun
        </h3>
        <div>
          <Label htmlFor="metroLine">Ligne de métro / Transport</Label>
          <Input
            id="metroLine"
            value={venue.metroLine || ''}
            onChange={(e) => onUpdate({ metroLine: e.target.value })}
            placeholder="Ex: Ligne 12 - Notre-Dame-des-Champs"
          />
          <p className="text-xs text-gray-500 mt-1">
            Indiquez la ligne et la station la plus proche
          </p>
        </div>
      </div>

      {/* Access Instructions */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Navigation className="w-5 h-5" />
          Instructions d&apos;accès
        </h3>
        <div>
          <Label htmlFor="accessInstructions">Instructions détaillées</Label>
          <Textarea
            id="accessInstructions"
            value={venue.accessInstructions || ''}
            onChange={(e) => onUpdate({ accessInstructions: e.target.value })}
            placeholder="Comment accéder au lieu, codes d'accès, étage, bâtiment..."
            rows={4}
          />
          <p className="text-xs text-gray-500 mt-1">
            Fournissez des instructions détaillées pour accéder au lieu
          </p>
        </div>
      </div>

      {/* Map Preview */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Localisation sur la carte
        </h3>
        <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center">
          <MapPin className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-center">Carte interactive à venir</p>
          <p className="text-sm text-gray-400 mt-2">
            {venue.address}, {venue.city} {venue.postalCode}
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Conseils pour les instructions d&apos;accès</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Indiquez l&apos;entrée spécifique (principale, artistes, livraisons)</li>
              <li>Précisez l&apos;étage et le numéro de salle si applicable</li>
              <li>Mentionnez les codes d&apos;accès ou interphones</li>
              <li>Ajoutez les horaires d&apos;accès si restreints</li>
              <li>Signalez les difficultés d&apos;accès PMR si existantes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
