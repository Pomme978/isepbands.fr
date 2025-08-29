'use client';

import React from 'react';
import CalendarEvent, {
  CalendarEvent as CalendarEventType,
  eventTypeStyles,
} from './CalendarEvent';
import LangLink from '@/components/common/LangLink';

interface CalendarDayProps {
  day: number;
  events: CalendarEventType[];
  isToday: boolean;
  isEmpty?: boolean;
}

export default function CalendarDay({ day, events, isToday, isEmpty = false }: CalendarDayProps) {
  if (isEmpty) {
    return <div style={{ width: '135px', height: '115px' }} />;
  }

  const hasEvents = events.length > 0;
  const primaryEvent = events[0]; // Premier événement pour la shadow
  const shadowStyle =
    hasEvents && primaryEvent ? eventTypeStyles[primaryEvent.type]?.shadow || '' : '';

  // Calculer les places restantes ou si c'est complet
  const getAvailabilityInfo = (event: CalendarEventType) => {
    if (!event.maxParticipants || event.currentParticipants === undefined) {
      return null;
    }

    if (event.currentParticipants >= event.maxParticipants) {
      return { isFull: true, remaining: 0 };
    }

    return { isFull: false, remaining: event.maxParticipants - event.currentParticipants };
  };

  const availability = primaryEvent ? getAvailabilityInfo(primaryEvent) : null;

  // Appliquer la couleur de fond selon le premier événement
  const dayStyles = hasEvents && primaryEvent ? eventTypeStyles[primaryEvent.type] : null;

  return (
    <div
      className={`
        border rounded-md relative p-3 transition-all duration-200
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
        ${hasEvents ? 'hover:brightness-110' : 'hover:border-gray-400 hover:bg-opacity-80'}
      `}
      style={{
        width: '135px',
        height: '115px',
        minHeight: '115px',
      }}
    >
      {/* Numéro du jour */}
      <div className="font-press-start-2p text-xs text-white absolute top-2 left-2">{day}</div>

      {/* Places restantes / complet (si événement complet seulement) */}
      {availability && availability.isFull && (
        <div className="absolute top-2 right-2">
          <div className="px-2 py-1 rounded-full text-[8px] font-ubuntu font-medium border bg-red-900/80 border-red-400 text-red-100">
            COMPLET
          </div>
        </div>
      )}

      {/* Événements */}
      {events.length > 0 && (
        <>
          {/* Titre centré */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-xs font-press-start-2p text-white text-center">
              {events[0].type.toUpperCase()}
            </div>
          </div>

          {/* Bouton en bas */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <LangLink
              href={`/events/${events[0].id}`}
              className="inline-block px-8 py-1 bg-white/10 border border-white/30 rounded-sm text-[10px] font-ubuntu font-medium text-white hover:bg-white/20 transition-all duration-200"
            >
              VOIR
            </LangLink>
          </div>

          {/* Indicateur pour plus d'événements */}
          {events.length > 1 && (
            <div className="absolute bottom-6 right-2 text-[8px] text-gray-400 font-press-start-2p">
              +{events.length - 1}
            </div>
          )}
        </>
      )}
    </div>
  );
}
