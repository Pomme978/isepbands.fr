// @components/profile/InstrumentCard.tsx
'use client';

import { Star, Guitar } from 'lucide-react';
import LevelBadge from './LevelBadge';
import React from 'react';

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
  const IconComponent = instrumentIcons[instrument.name as keyof typeof instrumentIcons] || Guitar;

  return (
    <div
      className={`relative group ${
        instrument.isPrimary
          ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-300 shadow-sm hover:shadow-md'
          : 'bg-white border border-gray-200 hover:shadow-md'
      } p-4 rounded-xl transition-all duration-200`}
    >
      {/* Primary instrument indicator */}
      {instrument.isPrimary && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-1 rounded-full shadow-sm">
            <Star className="h-3 w-3 text-white" />
          </div>
        </div>
      )}

      <div className="text-center space-y-3">
        {/* Icon */}
        <div
          className={`p-3 rounded-xl mx-auto w-fit ${
            instrument.isPrimary ? 'bg-purple-100' : 'bg-gray-100'
          }`}
        >
          <IconComponent
            className={`h-8 w-8 ${instrument.isPrimary ? 'text-purple-600' : 'text-gray-600'}`}
          />
        </div>

        {/* Instrument info */}
        <div className="space-y-2">
          <>
            <h4 className="font-bold text-gray-900 text-lg">{instrument.name}</h4>
            <div className="space-y-1">
              <LevelBadge level={instrument.level} />
              {instrument.yearsPlaying && (
                <p className="text-xs text-gray-500">
                  {instrument.yearsPlaying} ans d&apos;expérience
                </p>
              )}
              {instrument.isPrimary && (
                <p className="text-xs text-purple-600 font-medium">Instrument principal</p>
              )}
            </div>
          </>
        </div>
      </div>
    </div>
  );
}
