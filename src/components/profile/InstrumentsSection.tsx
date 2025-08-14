// @components/profile/InstrumentsSection.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Plus } from 'lucide-react';
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
  isEditing: boolean;
  instrumentOptions: string[];
  levelOptions: string[];
  onAddInstrument: () => void;
  onRemoveInstrument: (id: string) => void;
  onUpdateInstrument: (id: string, field: keyof Instrument, value: string | boolean) => void;
}

export default function InstrumentsSection({
  instruments,
  isEditing,
  instrumentOptions,
  levelOptions,
  onAddInstrument,
  onRemoveInstrument,
  onUpdateInstrument,
}: InstrumentsSectionProps) {
  const getGridCols = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2';
    if (count === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    if (count === 4) return 'grid-cols-2 lg:grid-cols-4';
    return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
  };

  return (
    <Card className="xl:col-span-2 p-6 border-0 h-fit">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Music className="h-6 w-6 text-purple-600" />
          Instruments
        </h2>
        {isEditing && (
          <Button onClick={onAddInstrument} size="sm" variant="outline" className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        )}
      </div>

      {instruments.length > 0 ? (
        <div className="space-y-4">
          <div className={`grid gap-4 ${getGridCols(instruments.length)}`}>
            {instruments.map((instrument) => (
              <InstrumentCard
                key={instrument.id}
                instrument={instrument}
                isEditing={isEditing}
                instrumentOptions={instrumentOptions}
                levelOptions={levelOptions}
                onUpdate={(field, value) => onUpdateInstrument(instrument.id, field, value)}
                onRemove={() => onRemoveInstrument(instrument.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Music}
          title="Aucun instrument ajouté"
          description="Ajoutez vos instruments pour que les groupes puissent vous trouver !"
          action={
            isEditing
              ? {
                  label: 'Ajouter votre premier instrument',
                  onClick: onAddInstrument,
                }
              : undefined
          }
        />
      )}
    </Card>
  );
}
