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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Users, Music } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: () => void;
}

export default function CreateEventModal({
  isOpen,
  onClose,
  onEventCreated,
}: CreateEventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: '',
    date: undefined as Date | undefined,
    time: '',
    venueId: '',
    associatedMembers: [] as string[],
    associatedGroups: [] as string[],
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock submission for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('Creating event:', formData);
      onEventCreated();
      onClose();

      // Reset form
      setFormData({
        title: '',
        description: '',
        eventType: '',
        date: undefined,
        time: '',
        venueId: '',
        associatedMembers: [],
        associatedGroups: [],
      });
    } catch (error) {
      console.error('Error creating event:', error);
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
          <DialogTitle>Créer un nouvel événement</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre de l&apos;événement</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Ex: Jam Session Hebdomadaire"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Description de l'événement..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="eventType">Type d&apos;événement</Label>
              <Select
                value={formData.eventType}
                onValueChange={(value) => updateField('eventType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JAM">Jam Session</SelectItem>
                  <SelectItem value="CONCERT">Concert</SelectItem>
                  <SelectItem value="RECORDING">Session d&apos;enregistrement</SelectItem>
                  <SelectItem value="WORKSHOP">Atelier</SelectItem>
                  <SelectItem value="MEETING">Réunion</SelectItem>
                  <SelectItem value="OTHER">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? (
                      format(formData.date, 'dd MMMM yyyy', { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => updateField('date', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="time">Heure</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => updateField('time', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Venue */}
          <div>
            <Label htmlFor="venue">Lieu</Label>
            <Select
              value={formData.venueId}
              onValueChange={(value) => updateField('venueId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un lieu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ndc">NDC - Salle de musique</SelectItem>
                <SelectItem value="ndl">NDL - Salle de répétition</SelectItem>
                <SelectItem value="neuilly">Salle de concert Neuilly</SelectItem>
                <SelectItem value="other">Autre lieu...</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type-specific options */}
          {formData.eventType === 'JAM' && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-blue-600" />
                <h4 className="font-medium text-blue-900">Membres associés</h4>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                Sélectionnez les membres qui participeront à cette jam session
              </p>
              <Button type="button" variant="outline" size="sm">
                Ajouter des membres
              </Button>
            </div>
          )}

          {formData.eventType === 'CONCERT' && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Music className="w-4 h-4 text-purple-600" />
                <h4 className="font-medium text-purple-900">Groupes participants</h4>
              </div>
              <p className="text-sm text-purple-700 mb-3">
                Sélectionnez les groupes qui joueront lors de ce concert
              </p>
              <Button type="button" variant="outline" size="sm">
                Ajouter des groupes
              </Button>
            </div>
          )}

          {formData.eventType === 'RECORDING' && (
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Music className="w-4 h-4 text-red-600" />
                <h4 className="font-medium text-red-900">Session d&apos;enregistrement</h4>
              </div>
              <p className="text-sm text-red-700">
                Configuration spécifique pour les sessions d&apos;enregistrement
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !formData.title || !formData.eventType}>
              {loading ? 'Création...' : 'Créer l&apos;événement'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
