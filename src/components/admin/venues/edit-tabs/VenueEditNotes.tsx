'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Info, Shield } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Venue {
  id: string;
  staffNotes?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'AVOID';
}

interface VenueEditNotesProps {
  venue: Venue;
  onUpdate: (updates: Partial<Venue>) => void;
}

export default function VenueEditNotes({ venue, onUpdate }: VenueEditNotesProps) {
  return (
    <div className="space-y-6">
      {/* Staff Notes */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Notes pour le staff
        </h3>
        <div>
          <Label htmlFor="staffNotes">
            Notes internes (visibles uniquement par l&apos;équipe admin)
          </Label>
          <Textarea
            id="staffNotes"
            value={venue.staffNotes || ''}
            onChange={(e) => onUpdate({ staffNotes: e.target.value })}
            placeholder="Informations importantes, problèmes connus, recommandations..."
            rows={6}
            className="font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-2">
            Ces notes sont confidentielles et ne seront visibles que par l&apos;équipe
            d&apos;administration
          </p>
        </div>
      </div>

      {/* Quick Status Change */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Statut rapide</h3>
        <div>
          <Label htmlFor="quickStatus">Changer le statut du lieu</Label>
          <Select
            value={venue.status}
            onValueChange={(value) => onUpdate({ status: value as Venue['status'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Actif - Lieu disponible pour les événements
                </div>
              </SelectItem>
              <SelectItem value="INACTIVE">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full" />
                  Inactif - Temporairement indisponible
                </div>
              </SelectItem>
              <SelectItem value="AVOID">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />À éviter - Problèmes connus
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status-specific warnings */}
      {venue.status === 'AVOID' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800 mb-2">
                Lieu marqué comme &quot;À éviter&quot;
              </h4>
              <p className="text-sm text-red-700 mb-3">
                Ce lieu apparaît dans une section spéciale avec un avertissement visible.
                Assurez-vous de documenter les raisons dans les notes ci-dessus.
              </p>
              <div className="text-sm text-red-600">
                <p className="font-medium mb-1">Exemples de raisons valides :</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Problèmes d&apos;acoustique ou d&apos;isolation phonique</li>
                  <li>Équipement défaillant ou manquant</li>
                  <li>Difficultés d&apos;accès récurrentes</li>
                  <li>Conflits avec le voisinage</li>
                  <li>Coûts cachés ou excessifs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {venue.status === 'INACTIVE' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">Lieu temporairement inactif</h4>
              <p className="text-sm text-yellow-700">
                Ce lieu n&apos;apparaît pas dans les options disponibles pour créer de nouveaux
                événements. Utilisez ce statut pour les fermetures temporaires, rénovations ou
                périodes de maintenance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
