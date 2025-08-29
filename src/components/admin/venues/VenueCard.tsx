'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LangLink from '@/components/common/LangLink';
import { MapPin, Camera, Train, AlertTriangle, Calendar, Eye, Edit, Archive } from 'lucide-react';

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

interface VenueCardProps {
  venue: Venue;
  onArchive?: (venueId: string, reason?: string) => void;
}

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

const VENUE_TYPE_COLORS = {
  CAMPUS: 'bg-blue-50 text-blue-700 border-blue-200',
  CONCERT_HALL: 'bg-purple-50 text-purple-700 border-purple-200',
  REHEARSAL_ROOM: 'bg-green-50 text-green-700 border-green-200',
  RECORDING_STUDIO: 'bg-red-50 text-red-700 border-red-200',
  BAR: 'bg-amber-50 text-amber-700 border-amber-200',
  RESTAURANT: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  NIGHTCLUB: 'bg-violet-50 text-violet-700 border-violet-200',
  EXTERNAL: 'bg-orange-50 text-orange-700 border-orange-200',
  OTHER: 'bg-gray-50 text-gray-700 border-gray-200',
};

const STATUS_COLORS = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  INACTIVE: 'bg-slate-50 text-slate-700 border-slate-200',
  AVOID: 'bg-red-50 text-red-700 border-red-200',
};

export default function VenueCard({ venue, onArchive }: VenueCardProps) {
  const isAvoidVenue = venue.status === 'AVOID';

  return (
    <Card
      className={`hover:shadow-md transition-all duration-200 ${
        isAvoidVenue ? 'border-red-200 bg-red-50/50' : 'hover:border-primary/30'
      }`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">{venue.name}</h3>
                <div className="flex items-center gap-2">
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
              </div>
              <Button asChild variant="ghost" size="sm">
                <LangLink href={`/admin/venues/${venue.id}`} className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  Voir
                </LangLink>
              </Button>
            </div>

            {venue.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{venue.description}</p>
            )}

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">
                  {venue.city} {venue.postalCode && `(${venue.postalCode})`}
                </span>
              </div>

              {venue.metroLine && (
                <div className="flex items-center gap-1.5">
                  <Train className="w-3.5 h-3.5 text-gray-400" />
                  <span className="truncate">{venue.metroLine}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>
                  {venue.eventsCount} événement{venue.eventsCount > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Staff Notes - Special warning for AVOID venues */}
            {venue.staffNotes && isAvoidVenue && (
              <div className="mt-3 p-2.5 rounded-md bg-red-100/50 border border-red-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600 mt-0.5" />
                  <p className="text-xs text-red-700 line-clamp-2">{venue.staffNotes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t">
            <LangLink
              href={`/admin/venues/${venue.id}`}
              className="inline-flex items-center px-3 py-1 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </LangLink>
            {onArchive && (
              <button
                onClick={() => onArchive(venue.id)}
                className="inline-flex items-center px-3 py-1 text-sm bg-orange-100 border border-orange-300 text-orange-800 rounded-md hover:bg-orange-200 transition-colors"
                title="Archiver le venue"
              >
                <Archive className="w-3 h-3 mr-1" />
                Archive
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
