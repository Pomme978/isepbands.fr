export interface Venue {
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

export const VENUE_TYPE_LABELS = {
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

export const VENUE_TYPE_COLORS = {
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

export const STATUS_COLORS = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  INACTIVE: 'bg-slate-50 text-slate-700 border-slate-200',
  AVOID: 'bg-red-50 text-red-700 border-red-200',
};
