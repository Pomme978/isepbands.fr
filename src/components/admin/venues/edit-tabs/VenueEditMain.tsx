'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

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
  status: 'ACTIVE' | 'INACTIVE' | 'AVOID';
}

interface VenueEditMainProps {
  venue: Venue;
  onUpdate: (updates: Partial<Venue>) => void;
}

export default function VenueEditMain({ venue, onUpdate }: VenueEditMainProps) {
  const handlePhotoUpload = () => {
    // TODO: Implement photo upload
    console.log('Photo upload not yet implemented');
  };

  const handlePhotoRemove = () => {
    onUpdate({ photoUrl: undefined });
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Informations générales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nom du lieu</Label>
            <Input
              id="name"
              value={venue.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Ex: NDC - Salle de musique"
            />
          </div>

          <div>
            <Label htmlFor="venueType">Type de lieu</Label>
            <Select
              value={venue.venueType}
              onValueChange={(value) => onUpdate({ venueType: value as Venue['venueType'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CAMPUS">Campus ISEP</SelectItem>
                <SelectItem value="CONCERT_HALL">Salle de concert</SelectItem>
                <SelectItem value="REHEARSAL_ROOM">Salle de répétition</SelectItem>
                <SelectItem value="RECORDING_STUDIO">Studio d&apos;enregistrement</SelectItem>
                <SelectItem value="BAR">Bar</SelectItem>
                <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                <SelectItem value="NIGHTCLUB">Boîte de nuit</SelectItem>
                <SelectItem value="EXTERNAL">Lieu externe</SelectItem>
                <SelectItem value="OTHER">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={venue.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Description du lieu..."
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Localisation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={venue.address}
              onChange={(e) => onUpdate({ address: e.target.value })}
              placeholder="Ex: 28 Rue Notre Dame des Champs"
            />
          </div>

          <div>
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              value={venue.city}
              onChange={(e) => onUpdate({ city: e.target.value })}
              placeholder="Ex: Paris"
            />
          </div>

          <div>
            <Label htmlFor="postalCode">Code postal</Label>
            <Input
              id="postalCode"
              value={venue.postalCode || ''}
              onChange={(e) => onUpdate({ postalCode: e.target.value })}
              placeholder="Ex: 75006"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="country">Pays</Label>
            <Input
              id="country"
              value={venue.country}
              onChange={(e) => onUpdate({ country: e.target.value })}
              placeholder="France"
            />
          </div>
        </div>
      </div>

      {/* Photo */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Photo du lieu</h3>
        <div className="flex items-start gap-4">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center relative overflow-hidden border-2 border-dashed border-gray-300">
            {venue.photoUrl ? (
              <>
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
                <button
                  onClick={handlePhotoRemove}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : null}
            <div
              className={`fallback-icon absolute inset-0 flex items-center justify-center ${venue.photoUrl ? 'hidden' : ''}`}
            >
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div>
            <Button variant="outline" onClick={handlePhotoUpload}>
              {venue.photoUrl ? 'Changer la photo' : 'Ajouter une photo'}
            </Button>
            <p className="text-xs text-gray-500 mt-2">Format: JPG, PNG. Taille max: 5MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
