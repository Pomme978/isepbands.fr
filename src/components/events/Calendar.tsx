'use client';

import React, { useState, useMemo } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarDay from './CalendarDay';
import CalendarDayMobile from './CalendarDayMobile';
import { CalendarEvent, eventTypeStyles } from './CalendarEvent';
import LangLink from '@/components/common/LangLink';

interface CalendarProps {
  events?: CalendarEvent[];
  className?: string;
}

// Données mockup étendues pour tester
const mockEvents: CalendarEvent[] = [
  // Janvier 2025
  {
    id: '1',
    title: 'Afterwork Session',
    type: 'afterwork',
    date: '2025-01-15',
    maxParticipants: 20,
    currentParticipants: 15,
  },
  {
    id: '2',
    title: 'Band Rehearsal',
    type: 'rehearsal',
    date: '2025-01-18',
    maxParticipants: 8,
    currentParticipants: 8,
  },
  {
    id: '3',
    title: 'Guitar Workshop',
    type: 'workshop',
    date: '2025-01-22',
    maxParticipants: 12,
    currentParticipants: 9,
  },
  {
    id: '4',
    title: 'Rock Concert',
    type: 'concert',
    date: '2025-01-25',
    maxParticipants: 100,
    currentParticipants: 85,
  },
  {
    id: '5',
    title: 'Jam Session',
    type: 'other',
    date: '2025-01-12',
    maxParticipants: 15,
    currentParticipants: 10,
  },
  {
    id: '6',
    title: 'Piano Workshop',
    type: 'workshop',
    date: '2025-01-12',
    maxParticipants: 8,
    currentParticipants: 6,
  },
  {
    id: '7',
    title: 'Friday Afterwork',
    type: 'afterwork',
    date: '2025-01-31',
    maxParticipants: 25,
    currentParticipants: 20,
  },

  // Août 2025 (mois minimum)
  {
    id: '8',
    title: 'Summer Concert',
    type: 'concert',
    date: '2025-08-15',
    maxParticipants: 200,
    currentParticipants: 180,
  },
  {
    id: '9',
    title: 'Beach Rehearsal',
    type: 'rehearsal',
    date: '2025-08-20',
    maxParticipants: 10,
    currentParticipants: 8,
  },
  {
    id: '10',
    title: 'Summer Workshop',
    type: 'workshop',
    date: '2025-08-25',
    maxParticipants: 15,
    currentParticipants: 15,
  },
  {
    id: '11',
    title: 'Sunset Afterwork',
    type: 'afterwork',
    date: '2025-08-30',
    maxParticipants: 30,
    currentParticipants: 25,
  },

  // Septembre 2025
  {
    id: '12',
    title: 'Back to School Concert',
    type: 'concert',
    date: '2025-09-05',
    maxParticipants: 150,
    currentParticipants: 120,
  },
  {
    id: '13',
    title: 'Drum Workshop',
    type: 'workshop',
    date: '2025-09-10',
    maxParticipants: 10,
    currentParticipants: 10,
  },
  {
    id: '14',
    title: 'Weekly Rehearsal',
    type: 'rehearsal',
    date: '2025-09-15',
    maxParticipants: 12,
    currentParticipants: 8,
  },
  {
    id: '15',
    title: 'Friday Night Afterwork',
    type: 'afterwork',
    date: '2025-09-19',
    maxParticipants: 20,
    currentParticipants: 18,
  },
  {
    id: '16',
    title: 'Open Mic Night',
    type: 'other',
    date: '2025-09-25',
    maxParticipants: 50,
    currentParticipants: 35,
  },

  // Décembre 2025
  {
    id: '17',
    title: 'Christmas Concert',
    type: 'concert',
    date: '2025-12-20',
    maxParticipants: 300,
    currentParticipants: 250,
  },
  {
    id: '18',
    title: 'Holiday Afterwork',
    type: 'afterwork',
    date: '2025-12-22',
    maxParticipants: 40,
    currentParticipants: 35,
  },
  {
    id: '19',
    title: 'New Year Rehearsal',
    type: 'rehearsal',
    date: '2025-12-28',
    maxParticipants: 15,
    currentParticipants: 12,
  },

  // Février 2026
  {
    id: '20',
    title: 'Valentine Concert',
    type: 'concert',
    date: '2026-02-14',
    maxParticipants: 100,
    currentParticipants: 95,
  },
  {
    id: '21',
    title: 'Love Songs Workshop',
    type: 'workshop',
    date: '2026-02-14',
    maxParticipants: 20,
    currentParticipants: 18,
  },
];

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Date limite : août 2025
const MIN_YEAR = 2025;
const MIN_MONTH = 7; // Août (index 7)

export default function Calendar({ events = mockEvents, className = '' }: CalendarProps) {
  // Initialiser avec la date actuelle, mais pas avant août 2025
  const initializeDate = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    if (currentYear < MIN_YEAR || (currentYear === MIN_YEAR && currentMonth < MIN_MONTH)) {
      return { month: MIN_MONTH, year: MIN_YEAR };
    }

    return { month: currentMonth, year: currentYear };
  };

  const initialDate = initializeDate();
  const [currentMonth, setCurrentMonth] = useState(initialDate.month);
  const [currentYear, setCurrentYear] = useState(initialDate.year);

  // Calculer les informations du calendrier
  const calendarData = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Ajuster pour que lundi soit le premier jour (0 = lundi, 6 = dimanche)
    let firstDayOfWeek = firstDayOfMonth.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === currentYear && today.getMonth() === currentMonth;
    const todayDate = isCurrentMonth ? today.getDate() : null;

    return {
      daysInMonth,
      firstDayOfWeek,
      todayDate,
      monthName: months[currentMonth],
      year: currentYear,
    };
  }, [currentMonth, currentYear]);

  // Filtrer les événements du mois actuel
  const monthEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === currentYear && eventDate.getMonth() === currentMonth;
    });
  }, [events, currentMonth, currentYear]);

  // Vérifier si on peut aller au mois précédent
  const canGoPrevious = () => {
    if (currentYear > MIN_YEAR) return true;
    if (currentYear === MIN_YEAR && currentMonth > MIN_MONTH) return true;
    return false;
  };

  // Navigation
  const goToPreviousMonth = () => {
    if (!canGoPrevious()) return;

    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Obtenir les événements d'un jour donné
  const getEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return monthEvents.filter((event) => event.date === dateStr);
  };

  // Générer les cases du calendrier
  const renderCalendarDays = () => {
    const days = [];

    // Cases vides pour les jours avant le premier du mois
    for (let i = 0; i < calendarData.firstDayOfWeek; i++) {
      days.push(<CalendarDay key={`empty-${i}`} day={0} events={[]} isToday={false} isEmpty />);
    }

    // Cases pour chaque jour du mois
    for (let day = 1; day <= calendarData.daysInMonth; day++) {
      const dayEvents = getEventsForDay(day);
      const isToday = day === calendarData.todayDate;

      days.push(<CalendarDay key={day} day={day} events={dayEvents} isToday={isToday} />);
    }

    return days;
  };

  // Générer les cases du calendrier pour mobile
  const renderCalendarDaysMobile = () => {
    const days = [];

    // Cases vides pour les jours avant le premier du mois
    for (let i = 0; i < calendarData.firstDayOfWeek; i++) {
      days.push(
        <CalendarDayMobile key={`empty-${i}`} day={0} events={[]} isToday={false} isEmpty />,
      );
    }

    // Cases pour chaque jour du mois
    for (let day = 1; day <= calendarData.daysInMonth; day++) {
      const dayEvents = getEventsForDay(day);
      const isToday = day === calendarData.todayDate;

      days.push(<CalendarDayMobile key={day} day={day} events={dayEvents} isToday={isToday} />);
    }

    return days;
  };

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      {/* Header avec navigation */}
      <CalendarHeader
        monthName={calendarData.monthName}
        year={calendarData.year}
        onPreviousMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
        canGoPrevious={canGoPrevious()}
      />

      {/* Grille du calendrier - Desktop */}
      <div
        className="hidden md:grid grid-cols-7"
        style={{ width: '980px', margin: '0 auto', gap: '12px' }}
      >
        {/* En-têtes des jours */}
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center py-3 font-press-start-2p text-sm"
            style={{ color: '#FFD166', width: '135px' }}
          >
            {day}
          </div>
        ))}

        {/* Cases des jours */}
        {renderCalendarDays()}
      </div>

      {/* Interface Mobile - Liste d'événements */}
      <div className="md:hidden" style={{ width: '350px', margin: '0 auto' }}>
        {/* Vue liste des événements du mois */}
        <div className="space-y-4">
          {monthEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-400 font-ubuntu">
              Aucun événement ce mois-ci
            </div>
          ) : (
            monthEvents
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((event) => {
                const eventDate = new Date(event.date);
                const dayNumber = eventDate.getDate();
                const dayName = [
                  'Lundi',
                  'Mardi',
                  'Mercredi',
                  'Jeudi',
                  'Vendredi',
                  'Samedi',
                  'Dimanche',
                ][eventDate.getDay() === 0 ? 6 : eventDate.getDay() - 1];
                const isToday = dayNumber === calendarData.todayDate;
                const styles = eventTypeStyles[event.type] || eventTypeStyles.other;

                // Calculer si c'est complet
                const isFull =
                  event.maxParticipants && event.currentParticipants
                    ? event.currentParticipants >= event.maxParticipants
                    : false;

                return (
                  <div
                    key={event.id}
                    className={`
                      ${styles.bg} ${styles.border} border rounded-lg p-4 transition-all duration-200
                      ${isToday ? 'ring-2 ring-white/50' : ''}
                      ${styles.shadow}
                    `}
                  >
                    {/* Date et jour */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`
                          w-12 h-12 rounded-full flex items-center justify-center font-press-start-2p text-sm text-white
                          ${isToday ? 'bg-white/20 border-2 border-white' : 'bg-black/20'}
                        `}
                        >
                          {dayNumber}
                        </div>
                        <div>
                          <div className="font-ubuntu font-medium text-white text-lg">
                            {dayName}
                          </div>
                        </div>
                      </div>

                      {/* Badge complet */}
                      {isFull && (
                        <div className="px-2 py-1 rounded-full text-xs font-ubuntu font-medium bg-red-900/80 border border-red-400 text-red-100">
                          COMPLET
                        </div>
                      )}
                    </div>

                    {/* Type d'événement */}
                    <div className="mb-3">
                      <h3 className="font-press-start-2p text-white text-sm mb-1">
                        {event.type.toUpperCase()}
                      </h3>
                      <p className="font-ubuntu text-white/80 text-sm">{event.title}</p>
                    </div>

                    {/* Participants et bouton */}
                    <div className="flex items-center justify-between">
                      {event.maxParticipants && event.currentParticipants !== undefined && (
                        <div className="text-xs font-ubuntu text-white/70">
                          {event.currentParticipants}/{event.maxParticipants} participants
                        </div>
                      )}

                      <LangLink
                        href={`/events/${event.id}`}
                        className="px-4 py-2 bg-white/10 border border-white/30 rounded-full text-sm font-ubuntu font-medium text-white hover:bg-white/20 transition-all duration-200"
                      >
                        VOIR DÉTAILS
                      </LangLink>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}
