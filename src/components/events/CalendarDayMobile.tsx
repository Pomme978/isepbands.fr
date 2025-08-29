'use client';

import React from 'react';
import { CalendarEvent as CalendarEventType, eventTypeStyles } from './CalendarEvent';
import LangLink from '@/components/common/LangLink';

interface CalendarDayMobileProps {
  day: number;
  events: CalendarEventType[];
  isToday: boolean;
  isEmpty?: boolean;
}

export default function CalendarDayMobile({
  day,
  events,
  isToday,
  isEmpty = false,
}: CalendarDayMobileProps) {
  if (isEmpty) {
    return <div className="aspect-square" />;
  }

  const hasEvents = events.length > 0;
  const primaryEvent = events[0];
  const shadowStyle =
    hasEvents && primaryEvent ? eventTypeStyles[primaryEvent.type]?.shadow || '' : '';

  // Calculer si c'est complet
  const getAvailabilityInfo = (event: CalendarEventType) => {
    if (!event.maxParticipants || event.currentParticipants === undefined) {
      return null;
    }
    return event.currentParticipants >= event.maxParticipants
      ? { isFull: true }
      : { isFull: false };
  };

  const availability = primaryEvent ? getAvailabilityInfo(primaryEvent) : null;
  const dayStyles = hasEvents && primaryEvent ? eventTypeStyles[primaryEvent.type] : null;

  return (
    <div
      className={`
        aspect-square border rounded-md relative p-1 transition-all duration-200 text-center
        ${
          isToday && hasEvents
            ? `${dayStyles?.border || 'border-white/80'} ${dayStyles?.bg || 'bg-white/20'} border-2`
            : isToday
              ? 'border-white/80 bg-white/20 border-2'
              : hasEvents
                ? `${dayStyles?.border || 'border-gray-600'} ${dayStyles?.bg || 'bg-transparent'}`
                : 'border-gray-600 bg-transparent'
        }
        ${shadowStyle}
        ${hasEvents ? 'hover:brightness-110' : 'hover:border-gray-400'}
      `}
    >
      {/* Numéro du jour */}
      <div className="font-press-start-2p text-[8px] text-white absolute top-0.5 left-0.5">
        {day}
      </div>

      {/* Indicateur complet */}
      {availability && availability.isFull && (
        <div className="absolute top-0.5 right-0.5">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
        </div>
      )}

      {/* Contenu de l'événement */}
      {hasEvents && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Type d'événement en très petit */}
          <div className="text-[6px] font-press-start-2p text-white mb-1 leading-none">
            {primaryEvent.type.slice(0, 4).toUpperCase()}
          </div>

          {/* Bouton minimaliste */}
          <LangLink
            href={`/events/${primaryEvent.id}`}
            className="text-[6px] font-ubuntu font-medium text-white bg-white/20 px-1 py-0.5 rounded hover:bg-white/30 transition-all duration-200"
          >
            VOIR
          </LangLink>
        </div>
      )}

      {/* Indicateur d'événements multiples */}
      {events.length > 1 && (
        <div className="absolute bottom-0 right-0.5 text-[6px] text-gray-400 font-press-start-2p">
          +{events.length - 1}
        </div>
      )}
    </div>
  );
}
