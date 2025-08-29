'use client';

import React from 'react';
import LangLink from '@/components/common/LangLink';

export type EventType = 'afterwork' | 'concert' | 'workshop' | 'rehearsal' | 'other';

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: string; // Format: YYYY-MM-DD
  maxParticipants?: number;
  currentParticipants?: number;
}

interface CalendarEventProps {
  event: CalendarEvent;
  isCompact?: boolean;
}

// Configuration des couleurs par type d'événement
export const eventTypeStyles = {
  afterwork: {
    bg: 'bg-green-900/80',
    border: 'border-green-400',
    shadow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]',
    text: 'text-green-100',
  },
  concert: {
    bg: 'bg-purple-900/80',
    border: 'border-purple-400',
    shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    text: 'text-purple-100',
  },
  workshop: {
    bg: 'bg-blue-900/80',
    border: 'border-blue-400',
    shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    text: 'text-blue-100',
  },
  rehearsal: {
    bg: 'bg-orange-900/80',
    border: 'border-orange-400',
    shadow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]',
    text: 'text-orange-100',
  },
  other: {
    bg: 'bg-gray-900/80',
    border: 'border-gray-400',
    shadow: 'shadow-[0_0_20px_rgba(156,163,175,0.3)]',
    text: 'text-gray-100',
  },
};

export default function CalendarEvent({ event, isCompact = false }: CalendarEventProps) {
  const styles = eventTypeStyles[event.type] || eventTypeStyles.other;

  return (
    <LangLink
      href={`/events/${event.id}`}
      className={`
        block px-2 py-1 rounded-full text-xs font-ubuntu font-medium text-center transition-all duration-200
        ${styles.bg} ${styles.border} ${styles.text} border hover:opacity-80 hover:scale-105
        ${isCompact ? 'text-[8px] py-0.5' : ''}
      `}
      title={event.title}
    >
      {isCompact ? event.type.slice(0, 3).toUpperCase() : event.type.toUpperCase()}
    </LangLink>
  );
}
