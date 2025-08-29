'use client';

import EventsScroller from '@/components/events/EventsScroller';
import GridBackground from '@/components/events/GridBackground';
import EventPosters from '@/components/events/EventPosters';
import ChristmasGarland from '@/components/events/ChristmasGarland';
import SignBoard from '@/components/events/SignBoard';
import Calendar from '@/components/events/Calendar';
import { useIsMobile } from '@/hooks/useIsMobile';
import React from 'react';

export default function EventsPage() {
  const isMobile = useIsMobile();

  // Données mockup pour les événements
  const mockEvents = [
    { id: '1', text: 'Next Jam This Saturday at 6pm * NDL * With your group : "the f(l)avors"' },
    { id: '2', text: 'Concert Rock Night - Friday 8pm * Amphi 1 * Open Mic Session' },
    { id: '3', text: 'Band Rehearsal - Monday 7pm * Studio B * All Members Welcome' },
    { id: '4', text: 'Music Workshop - Wednesday 6pm * Room 202 * Guitar Masterclass' },
  ];

  return (
    <main className="min-h-screen">
      <div className="w-full h-80 md:h-100 flex md:mt-0 mt-10 justify-center items-center flex-col">
        <h1
          className="font-normal font-monoton text-5xl md:text-8xl leading-none text-white mb-16 text-center"
          style={{
            WebkitTextStroke: isMobile ? '1px #FFFFFF' : '2.5px #FFFFFF',
            textShadow: isMobile
              ? '0 0 60px rgba(255, 46, 90, 0.6), 0 0 30px rgba(255, 46, 90, 0.5), 0 0 15px rgba(255, 46, 90, 0.4), 0 0 8px rgba(255, 46, 90, 0.3)'
              : '0 0 203px rgba(255, 46, 90, 0.71), 0 0 118.887px rgba(255, 46, 90, 0.74), 0 0 94.659px rgba(255, 46, 90, 0.43), 0 0 32.987px rgba(255, 46, 90, 0.65), 0 0 16.541px rgba(255, 46, 90, 0.28), 0 0 7.988px rgba(255, 46, 90, 0.17), 0 0 30px rgba(255, 255, 255, 0.3), 0 0 15px rgba(255, 255, 255, 0.2)',
            wordSpacing: '0.3em',
          }}
        >
          OUR EVENTS
        </h1>

        <div className="w-full md:mt-0 -mt-10">
          <EventsScroller events={mockEvents} />
        </div>
      </div>

      <GridBackground
        lineSpacing={100}
        className="z-40 pb-10"
        style={{ borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px' }}
      >
        <EventPosters />
      </GridBackground>

      {/* Guirlande et panneau avec effet de profondeur */}
      <div className="relative w-full -top-23 min-h-100 flex justify-center items-center flex-col bg-[#19192B] overflow-x-hidden">
        <div className="shadow-2xl h-30 -top-10 z-[8] w-full bg-[#fffff] rounded-[50px] absolute"></div>

        {/* ChristmasGarland - niveau intermédiaire */}
        <ChristmasGarland
          seed="isepbands-christmas-2024"
          className="top-10 md:top-10 absolute z-50 md:z-20"
        />

        {/* SignBoard - au-dessus (avec seulement le support droit) */}
        <div className="mt-46 w-screen z-30">
          <SignBoard
            title="THE CALENDAR"
            className="-top-20 md:-top-16"
            hideLeftSupport={false}
            hideRightSupport={false}
          />
        </div>

        <div className="mt-0 md:mt-16 px-8 overflow-hidden">
          <div className="relative z-10">
            <Calendar />
          </div>
        </div>

        <div className="py-20 "></div>
      </div>

      <h5 className="text-[10px] text-white/70 relative max-w-7xl flex font-press-start-2p justify-center md:justify-end mx-auto pt-8">
        Design de page réalisé par Sarah LEVY
      </h5>
    </main>
  );
}
