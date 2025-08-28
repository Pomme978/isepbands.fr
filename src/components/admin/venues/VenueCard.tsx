'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Edit,
  Trash2,
  Users,
  Camera,
  Train,
  AlertTriangle,
  Calendar,
  Eye,
} from 'lucide-react';

interface Venue {
  id: string;
  name: string;
  description?: string;
  venueType:
    | 'CAMPUS'
    | 'CONCERT_HALL'
    | 'REHEARSAL_ROOM'
    | 'RECORDING_STUDIO'
    | 'EXTERNAL'
    | 'OTHER';
  address: string;
  city: string;
  postalCode?: string;
  country: string;
  capacity?: number;
  photoUrl?: string;
  metroLine?: string;
  accessInstructions?: string;
  staffNotes?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'AVOID';
  createdAt: string;
  eventsCount: number;
}

interface VenueCardProps {
  venue: Venue;
}

const VENUE_TYPE_LABELS = {
  CAMPUS: 'Campus ISEP',
  CONCERT_HALL: 'Salle de concert',
  REHEARSAL_ROOM: 'Salle de répétition',
  RECORDING_STUDIO: "Studio d'enregistrement",
  EXTERNAL: 'Lieu externe',
  OTHER: 'Autre',
};

const VENUE_TYPE_COLORS = {
  CAMPUS: 'bg-blue-50 text-blue-700 border-blue-200',
  CONCERT_HALL: 'bg-purple-50 text-purple-700 border-purple-200',
  REHEARSAL_ROOM: 'bg-green-50 text-green-700 border-green-200',
  RECORDING_STUDIO: 'bg-red-50 text-red-700 border-red-200',
  EXTERNAL: 'bg-orange-50 text-orange-700 border-orange-200',
  OTHER: 'bg-gray-50 text-gray-700 border-gray-200',
};

const STATUS_COLORS = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  INACTIVE: 'bg-slate-50 text-slate-700 border-slate-200',
  AVOID: 'bg-red-50 text-red-700 border-red-200',
};

export default function VenueCard({ venue }: VenueCardProps) {
  const isAvoidVenue = venue.status === 'AVOID';

  return (
    <Card
      className={`p-6 hover:shadow-md transition-shadow ${isAvoidVenue ? 'border-red-200 bg-red-50' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{venue.name}</h3>
            <Badge className={VENUE_TYPE_COLORS[venue.venueType]}>
              {VENUE_TYPE_LABELS[venue.venueType]}
            </Badge>
            <Badge className={STATUS_COLORS[venue.status]}>
              {venue.status === 'ACTIVE'
                ? 'Actif'
                : venue.status === 'INACTIVE'
                  ? 'Inactif'
                  : 'À éviter'}
            </Badge>
          </div>

          {venue.description && <p className="text-gray-600 mb-3">{venue.description}</p>}

          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>
                {venue.address}, {venue.city}
                {venue.postalCode && ` ${venue.postalCode}`}
              </span>
            </div>

            {venue.capacity && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Capacité: {venue.capacity} personnes</span>
              </div>
            )}

            {venue.metroLine && (
              <div className="flex items-center gap-2">
                <Train className="w-4 h-4" />
                <span>{venue.metroLine}</span>
              </div>
            )}

            {venue.accessInstructions && (
              <div className="flex items-start gap-2">
                <Camera className="w-4 h-4 mt-0.5" />
                <span>{venue.accessInstructions}</span>
              </div>
            )}
          </div>

          {/* Events History */}
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              {venue.eventsCount} événement{venue.eventsCount > 1 ? 's' : ''} organisé
              {venue.eventsCount > 1 ? 's' : ''}
            </span>
          </div>

          {/* Staff Notes - Special warning for AVOID venues */}
          {venue.staffNotes && (
            <div
              className={`mt-3 p-3 rounded-lg flex items-start gap-2 ${
                isAvoidVenue
                  ? 'bg-red-100 border border-red-200'
                  : 'bg-yellow-100 border border-yellow-200'
              }`}
            >
              <AlertTriangle
                className={`w-4 h-4 mt-0.5 ${isAvoidVenue ? 'text-red-600' : 'text-yellow-600'}`}
              />
              <div>
                <h4
                  className={`font-medium text-sm ${
                    isAvoidVenue ? 'text-red-800' : 'text-yellow-800'
                  }`}
                >
                  Note pour le staff:
                </h4>
                <p className={`text-sm mt-1 ${isAvoidVenue ? 'text-red-700' : 'text-yellow-700'}`}>
                  {venue.staffNotes}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Historique
          </Button>

          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className={`${isAvoidVenue ? 'text-red-600 hover:text-red-700' : 'text-red-600 hover:text-red-700'}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
