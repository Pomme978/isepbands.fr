'use client';

import FamousEventCard from './FamousEventCard';

export default function OurFamousEvents() {
  const events = [
    {
      title: 'JAMS',
      description: 'blahblahblahblahblah\nblahblah',
      imageUrl: '/api/placeholder/400/300',
      imageAlt: 'Jams session',
    },
    {
      title: 'SHOWS',
      description: 'blahblahblahblahblah\nblahblah',
      imageUrl: '/api/placeholder/400/300',
      imageAlt: 'Shows performance',
    },
    {
      title: 'STUDIO RECORDINGS',
      description: 'blahblahblahblahblah\nblahblah',
      imageUrl: '/api/placeholder/400/300',
      imageAlt: 'Studio recordings',
    },
  ];

  return (
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-12">OUR FAMOUS EVENTS</h2>

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
