'use client';

import FamousEventCard from './FamousEventCard';
import { useI18n } from '@/locales/client';

export default function OurFamousEvents() {
  const t = useI18n();

  const events = [
    {
      title: t('page.home.events.famous.jams.title'),
      description: t('page.home.events.famous.jams.description'),
      imageUrl: '/api/placeholder/400/300',
      imageAlt: 'Jams session',
    },
    {
      title: t('page.home.events.famous.shows.title'),
      description: t('page.home.events.famous.shows.description'),
      imageUrl: '/api/placeholder/400/300',
      imageAlt: 'Shows performance',
    },
    {
      title: t('page.home.events.famous.recordings.title'),
      description: t('page.home.events.famous.recordings.description'),
      imageUrl: '/api/placeholder/400/300',
      imageAlt: 'Studio recordings',
    },
  ];

  return (
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-12">
        {t('page.home.events.famous.title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <FamousEventCard
            key={index}
            title={event.title}
            description={event.description}
            imageUrl={event.imageUrl}
            imageAlt={event.imageAlt}
          />
        ))}
      </div>
    </div>
  );
}
