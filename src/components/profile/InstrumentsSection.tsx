// @components/settings/InstrumentsSection.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Music } from 'lucide-react';
import InstrumentCard from './InstrumentCard';
import EmptyState from './EmptyState';
import React from 'react';

interface Instrument {
  id: string;
  name: string;
  level: string;
  icon: React.ComponentType<{ className?: string }>;
  isPrimary: boolean;
  yearsPlaying?: number;
}

interface InstrumentsSectionProps {
  instruments: Instrument[];
}

export default function InstrumentsSection({ instruments }: InstrumentsSectionProps) {
  const getGridCols = () => {
    // Always use the same grid with max 4 columns, items will pile up from left
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  };

  return (
    <Card className="xl:col-span-2 p-6 border-0 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Music className="h-6 w-6 text-purple-600" />
          Instruments
        </h2>
      </div>

      <div className="flex-1">
        {instruments.length > 0 ? (
          <div className="space-y-4">
            <div className={`grid gap-4 ${getGridCols()}`}>
              {instruments.map((instrument) => (
                <InstrumentCard key={instrument.id} instrument={instrument} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Music}
            title="Aucun instrument ajouté"
            description="Ajoutez vos instruments pour que les groupes puissent vous trouver !"
          />
        )}
      </div>
    </Card>
  );
}
