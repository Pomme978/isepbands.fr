'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { AlertTriangle } from 'lucide-react';

interface CreateVenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVenueCreated: () => void;
}

export default function CreateVenueModal({
  isOpen,
  onClose,
  onVenueCreated,
}: CreateVenueModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    venueType: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    capacity: '',
    metroLine: '',
    accessInstructions: '',
    staffNotes: '',
    status: 'ACTIVE',
    photoUrl: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock submission for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('Creating venue:', formData);
      onVenueCreated();
      onClose();

      // Reset form
      setFormData({
        name: '',
        description: '',
        venueType: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'France',
        capacity: '',
        metroLine: '',
        accessInstructions: '',
        staffNotes: '',
        status: 'ACTIVE',
        photoUrl: '',
      });
    } catch (error) {
      console.error('Error creating venue:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau lieu</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom du lieu</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Ex: Salle de concert Neuilly"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Description du lieu..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="venueType">Type de lieu</Label>
              <Select
                value={formData.venueType}
                onValueChange={(value) => updateField('venueType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CAMPUS">Campus ISEP</SelectItem>
                  <SelectItem value="CONCERT_HALL">Salle de concert</SelectItem>
                  <SelectItem value="REHEARSAL_ROOM">Salle de répétition</SelectItem>
                  <SelectItem value="RECORDING_STUDIO">Studio d&apos;enregistrement</SelectItem>
                  <SelectItem value="EXTERNAL">Lieu externe</SelectItem>
                  <SelectItem value="OTHER">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Adresse</h4>

            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Ex: 28 Rue Notre Dame des Champs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="Ex: Paris"
                  required
                />
              </div>

              <div>
                <Label htmlFor="postalCode">Code postal</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => updateField('postalCode', e.target.value)}
                  placeholder="Ex: 75006"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="country">Pays</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => updateField('country', e.target.value)}
                placeholder="France"
                required
              />
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Informations complémentaires</h4>

            <div>
              <Label htmlFor="capacity">Capacité (personnes)</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => updateField('capacity', e.target.value)}
                placeholder="Ex: 50"
              />
            </div>

            <div>
              <Label htmlFor="metroLine">Ligne de métro / Transport</Label>
              <Input
                id="metroLine"
                value={formData.metroLine}
                onChange={(e) => updateField('metroLine', e.target.value)}
                placeholder="Ex: Ligne 12 - Notre-Dame-des-Champs"
              />
            </div>

            <div>
              <Label htmlFor="accessInstructions">Instructions d&apos;accès</Label>
              <Textarea
                id="accessInstructions"
                value={formData.accessInstructions}
                onChange={(e) => updateField('accessInstructions', e.target.value)}
                placeholder="Comment accéder au lieu, codes d'accès, etc..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="photoUrl">URL de la photo</Label>
              <Input
                id="photoUrl"
                value={formData.photoUrl}
                onChange={(e) => updateField('photoUrl', e.target.value)}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </div>

          {/* Staff Notes */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="staffNotes">Notes pour le staff</Label>
              <Textarea
                id="staffNotes"
                value={formData.staffNotes}
                onChange={(e) => updateField('staffNotes', e.target.value)}
                placeholder="Notes internes, problèmes connus, recommandations..."
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Ces notes ne seront visibles que par l&apos;équipe d&apos;administration
              </p>
            </div>

            <div>
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => updateField('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Statut du lieu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Actif</SelectItem>
                  <SelectItem value="INACTIVE">Inactif</SelectItem>
                  <SelectItem value="AVOID">À éviter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.status === 'AVOID' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <h4 className="font-medium text-red-900">Lieu marqué &quot;À éviter&quot;</h4>
                </div>
                <p className="text-sm text-red-700">
                  Ce lieu sera affiché dans une section spéciale avec un avertissement. Assurez-vous
                  d&apos;avoir rempli les notes pour le staff avec les raisons.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !formData.name || !formData.venueType}>
              {loading ? 'Création...' : 'Ajouter le lieu'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
