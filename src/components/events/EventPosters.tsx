'use client';

import LangLink from '../common/LangLink';

interface Event {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
}

interface EventPostersProps {
  currentEvent?: Event;
  previousEvent?: Event;
  nextEvent?: Event;
}

const fallbackEvent: Event = {
  id: 'fallback',
  title: 'COMING SOON',
  date: '-- --- ----',
  imageUrl: 'https://picsum.photos/400/600?random=0', // Placeholder pour le moment
};

// Mockup events
const mockEvents = {
  previous: {
    id: 'prev-1',
    title: 'WINTER FEST',
    date: '15 DÉCEMBRE 2024',
    imageUrl: 'https://picsum.photos/400/600?random=1',
  },
  current: {
    id: 'curr-1',
    title: 'MID-YEAR SHOW',
    date: '07 JANVIER 2025',
    imageUrl: 'https://picsum.photos/400/600?random=2',
  },
  next: {
    id: 'next-1',
    title: 'SPRING CONCERT',
    date: '20 MARS 2025',
    imageUrl: 'https://picsum.photos/400/600?random=3',
  },
};

export default function EventPosters({
  currentEvent,
  previousEvent,
  nextEvent,
}: EventPostersProps) {
  const events = {
    previous: previousEvent || mockEvents.previous,
    current: currentEvent || mockEvents.current,
    next: nextEvent || mockEvents.next,
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-8 py-16">
      <div className="grid grid-cols-3 gap-8 items-end">
        {/* Colonne 1 - Événement précédent */}
        <div className="flex justify-center">
          <EventPoster event={events.previous} size="small" isActive={false} />
        </div>

        {/* Colonne 2 - Événement actuel (central) */}
        <div className="flex justify-center">
          <EventPoster event={events.current} size="large" isActive={true} />
        </div>

        {/* Colonne 3 - Événement suivant */}
        <div className="flex justify-center">
          <EventPoster event={events.next} size="small" isActive={false} />
        </div>
      </div>
    </div>
  );
}

interface EventPosterProps {
  event: Event;
  size: 'small' | 'large';
  isActive: boolean;
}

function EventPoster({ event, size, isActive }: EventPosterProps) {
  const isLarge = size === 'large';
  const posterWidth = isLarge ? 320 : 260; // en pixels - agrandi les cadres latéraux
  const posterHeight = isLarge ? 480 : 390; // en pixels - agrandi les cadres latéraux

  // Calcul correct du placement des lumières - une dans chaque coin et espacement égal
  const bulbSpacing = 20; // espacement entre les boules
  const cornerOffset = 6; // décalage depuis les coins
  const bulbsPerSide = {
    horizontal: Math.max(2, Math.floor((posterWidth - 2 * cornerOffset) / bulbSpacing) + 1), // +1 pour inclure les coins
    vertical: Math.max(2, Math.floor((posterHeight - 2 * cornerOffset) / bulbSpacing) + 1),
  };

  return (
    <div className="relative flex flex-col items-center group">
      {/* Ombre bleue derrière le cadre */}
      <div
        className={`
          absolute top-0 left-1/2 transform -translate-x-1/2 bg-black
          ${
            isActive
              ? 'shadow-[0_0_40px_rgba(0,230,255,0.3),0_0_80px_rgba(0,230,255,0.2),0_0_120px_rgba(0,230,255,0.1)]'
              : 'shadow-[0_0_20px_rgba(0,230,255,0.2),0_0_40px_rgba(0,230,255,0.1)]'
          }
        `}
        style={{
          width: `${posterWidth}px`,
          height: `${posterHeight}px`,
          zIndex: -1,
        }}
      />

      {/* Cadre avec boules */}
      <div
        className="relative bg-black"
        style={{
          width: `${posterWidth}px`,
          height: `${posterHeight}px`,
        }}
      >
        {/* Boules jaunes dans les coins et sur les bords */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Boules du haut - avec espacement calculé pour inclure les coins */}
          {Array.from({ length: bulbsPerSide.horizontal }, (_, i) => {
            const totalSpacing = (bulbsPerSide.horizontal - 1) * bulbSpacing;
            const startX = (posterWidth - totalSpacing) / 2;
            return (
              <div
                key={`top-${i}`}
                className="absolute w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(255,255,0,0.8)]"
                style={{
                  top: `${cornerOffset}px`,
                  left: `${startX + i * bulbSpacing - 4}px`, // -4 pour centrer la boule de 8px
                  animation: `twinkle ${4 + i * 0.2}s ease-in-out infinite alternate`,
                }}
              />
            );
          })}

          {/* Boules du bas - avec espacement calculé pour inclure les coins */}
          {Array.from({ length: bulbsPerSide.horizontal }, (_, i) => {
            const totalSpacing = (bulbsPerSide.horizontal - 1) * bulbSpacing;
            const startX = (posterWidth - totalSpacing) / 2;
            return (
              <div
                key={`bottom-${i}`}
                className="absolute w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(255,255,0,0.8)]"
                style={{
                  bottom: `${cornerOffset}px`,
                  left: `${startX + i * bulbSpacing - 4}px`, // -4 pour centrer la boule de 8px
                  animation: `twinkle ${4.5 + i * 0.2}s ease-in-out infinite alternate`,
                }}
              />
            );
          })}

          {/* Boules de gauche - sans les coins pour éviter la duplication */}
          {Array.from({ length: Math.max(0, bulbsPerSide.vertical - 2) }, (_, i) => {
            const totalSpacing = (bulbsPerSide.vertical - 1) * bulbSpacing;
            const startY = (posterHeight - totalSpacing) / 2;
            return (
              <div
                key={`left-${i}`}
                className="absolute w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(255,255,0,0.8)]"
                style={{
                  left: `${cornerOffset}px`,
                  top: `${startY + (i + 1) * bulbSpacing - 4}px`, // +1 pour éviter le coin supérieur, -4 pour centrer
                  animation: `twinkle ${3.8 + i * 0.2}s ease-in-out infinite alternate`,
                }}
              />
            );
          })}

          {/* Boules de droite - sans les coins pour éviter la duplication */}
          {Array.from({ length: Math.max(0, bulbsPerSide.vertical - 2) }, (_, i) => {
            const totalSpacing = (bulbsPerSide.vertical - 1) * bulbSpacing;
            const startY = (posterHeight - totalSpacing) / 2;
            return (
              <div
                key={`right-${i}`}
                className="absolute w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(255,255,0,0.8)]"
                style={{
                  right: `${cornerOffset}px`,
                  top: `${startY + (i + 1) * bulbSpacing - 4}px`, // +1 pour éviter le coin supérieur, -4 pour centrer
                  animation: `twinkle ${4.2 + i * 0.2}s ease-in-out infinite alternate`,
                }}
              />
            );
          })}
        </div>

        {/* Cadre sans ombre (ombre déplacée derrière) */}
        <div className="absolute inset-5 bg-black overflow-hidden">
          {/* Image de l'événement */}
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Informations en dessous du cadre */}
      <div className="mt-6 text-center">
        <h3
          className={`
            font-impact uppercase text-white mb-2
            ${isLarge ? 'text-2xl' : 'text-xl'}
          `}
          style={{
            textShadow:
              '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.4)',
          }}
        >
          {event.title} • {event.date}
        </h3>

        <LangLink
          href={`/events/${event.id}`}
          className={`
            font-press-start-2p text-white underline hover:text-gray-200 transition-colors
            ${isLarge ? 'text-[10px]' : 'text-[8px]'}
          `}
        >
          click to learn more &gt;
        </LangLink>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0% {
            opacity: 0.4;
            transform: scale(0.8);
            box-shadow: 0 0 8px rgba(255, 255, 0, 0.4);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
            box-shadow:
              0 0 16px rgba(255, 255, 0, 1),
              0 0 24px rgba(255, 255, 0, 0.8);
          }
          100% {
            opacity: 0.6;
            transform: scale(0.9);
            box-shadow: 0 0 10px rgba(255, 255, 0, 0.6);
          }
        }
      `}</style>
    </div>
  );
}
