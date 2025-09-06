// @components/settings/InstrumentCard.tsx
'use client';

import { Star, Guitar } from 'lucide-react';
import LevelBadge from './LevelBadge';
import React from 'react';
import { useI18n } from '@/locales/client';

interface Instrument {
  id: string;
  name: string;
  level: string;
  icon: React.ComponentType<{ className?: string }>;
  isPrimary: boolean;
  yearsPlaying?: number;
}

interface InstrumentCardProps {
  instrument: Instrument;
}

const instrumentIcons = {
  Guitare: Guitar,
  Piano: Guitar,
  Chant: Guitar,
  Batterie: Guitar,
  Basse: Guitar,
  Violon: Guitar,
  Flûte: Guitar,
  Saxophone: Guitar,
};

export default function InstrumentCard({ instrument }: InstrumentCardProps) {
  const t = useI18n();
  const IconComponent = instrumentIcons[instrument.name as keyof typeof instrumentIcons] || Guitar;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="text-center space-y-3">
        <div className="p-3 bg-gray-50 rounded-lg mx-auto w-fit">
          <IconComponent className="h-6 w-6 text-gray-600" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h4 className="font-semibold text-gray-900">{instrument.name}</h4>
            {instrument.isPrimary && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
          </div>

          <LevelBadge level={instrument.level} size="sm" />

          {instrument.yearsPlaying && instrument.yearsPlaying > 0 && (
            <p className="text-sm text-gray-500">
              {instrument.yearsPlaying === 1
                ? t('user.profile.instruments.years_experience_single')
                : t('user.profile.instruments.years_experience_multiple', {
                    years: instrument.yearsPlaying,
                  })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
