'use client';

import { Guitar } from 'lucide-react';
import InstrumentsSection from '@/components/profile/InstrumentsSection';
import { getSkillLevelFr } from '@/utils/skillLevelUtils';

// Shared types for consistency
export interface ApiInstrument {
  instrument: { 
    id: string; 
    name?: string;
    nameFr?: string;
    nameEn?: string;
  };
  instrumentId?: string; // Fallback for different API formats
  skillLevel: string;
  yearsPlaying?: number;
  isPrimary: boolean;
}

export interface DisplayInstrument {
  id: string;
  name: string;
  level: string;
  icon: React.ComponentType<{ className?: string }>;
  isPrimary: boolean;
  yearsPlaying?: number;
}

interface InstrumentsDisplayProps {
  instruments: ApiInstrument[];
}

export function InstrumentsDisplay({ instruments }: InstrumentsDisplayProps) {
  // Transform API instruments to display format with consistent logic
  const displayInstruments: DisplayInstrument[] = instruments.map((inst) => ({
    id: inst.instrument?.id?.toString() || inst.instrumentId?.toString() || '',
    name: inst.instrument?.nameFr || inst.instrument?.nameEn || inst.instrument?.name || 'Instrument inconnu',
    level: getSkillLevelFr(inst.skillLevel || 'BEGINNER'), // Always translate to French
    icon: Guitar,
    isPrimary: Boolean(inst.isPrimary),
    yearsPlaying: inst.yearsPlaying !== undefined && inst.yearsPlaying !== null ? inst.yearsPlaying : undefined,
  }));

  return <InstrumentsSection instruments={displayInstruments} />;
}