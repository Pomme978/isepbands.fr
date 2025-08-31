'use client';

import { Card } from '@/components/ui/card';
import { Headphones } from 'lucide-react';
import EmptyState from './EmptyState';
import React from 'react';
import { MUSIC_GENRES, getMusicGenreDisplay } from '@/data/musicGenres';

interface MusicGenresSectionProps {
  genres: string[];
  locale?: 'fr' | 'en';
}

export default function MusicGenresSection({ genres, locale = 'fr' }: MusicGenresSectionProps) {
  if (!genres || genres.length === 0) {
    return (
      <Card className="xl:col-span-2 p-6 border-0 h-fit">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Headphones className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Genres musicaux</h3>
            <p className="text-sm text-gray-500">Styles de musique préférés</p>
          </div>
        </div>
        <EmptyState
          icon={<Headphones className="w-8 h-8" />}
          message="Aucun genre musical renseigné"
          description="Les genres musicaux apparaîtront ici une fois ajoutés"
        />
      </Card>
    );
  }

  return (
    <Card className="xl:col-span-2 p-6 border-0 h-fit">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Headphones className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Genres musicaux</h3>
          <p className="text-sm text-gray-500">
            {genres.length} genre{genres.length > 1 ? 's' : ''} préféré
            {genres.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {genres.map((genreId, index) => {
          const displayName = getMusicGenreDisplay(genreId, locale);
          return (
            <div
              key={index}
              className="inline-flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-100"
            >
              {displayName}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
