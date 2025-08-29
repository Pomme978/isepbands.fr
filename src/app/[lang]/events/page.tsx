import EventsScroller from '@/components/events/EventsScroller';
import GridBackground from '@/components/events/GridBackground';
import EventPosters from '@/components/events/EventPosters';
import ChristmasGarland from '@/components/events/ChristmasGarland';
import SignBoard from '@/components/events/SignBoard';
import React from 'react';

export default function EventsPage() {
  // Données mockup pour les événements
  const mockEvents = [
    { id: '1', text: 'Next Jam This Saturday at 6pm * NDL * With your group : "the f(l)avors"' },
    { id: '2', text: 'Concert Rock Night - Friday 8pm * Amphi 1 * Open Mic Session' },
    { id: '3', text: 'Band Rehearsal - Monday 7pm * Studio B * All Members Welcome' },
    { id: '4', text: 'Music Workshop - Wednesday 6pm * Room 202 * Guitar Masterclass' },
  ];

  return (
    <main className="min-h-screen">
      <div className="w-full h-100 flex justify-center items-center flex-col">
        <h1
          className="font-normal font-monoton text-8xl leading-none text-white mb-16"
          style={{
            WebkitTextStroke: '2.5px #FFFFFF',
            textShadow:
              '0 0 203px rgba(255, 46, 90, 0.71), 0 0 118.887px rgba(255, 46, 90, 0.74), 0 0 94.659px rgba(255, 46, 90, 0.43), 0 0 32.987px rgba(255, 46, 90, 0.65), 0 0 16.541px rgba(255, 46, 90, 0.28), 0 0 7.988px rgba(255, 46, 90, 0.17), 0 0 30px rgba(255, 255, 255, 0.3), 0 0 15px rgba(255, 255, 255, 0.2)',
            wordSpacing: '0.3em',
          }}
        >
          OUR EVENTS
        </h1>

        <div className="w-full mt-0">
          <EventsScroller events={mockEvents} />
        </div>
      </div>

      <GridBackground
        lineSpacing={100}
        className="z-10 pb-10"
        style={{ borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px' }}
      >
        <EventPosters />
      </GridBackground>

      {/* Guirlande et panneau avec effet de profondeur */}
      <div className="relative w-full -top-23 min-h-100 flex justify-center items-center flex-col bg-[#19192B]">
        <div className="shadow-2xl h-30 -top-10 z-[8] w-full bg-[#fffff] rounded-[50px] absolute"></div>
        {/* Support gauche - DERRIÈRE tout - visible et bien positionné */}
        <div
          className="absolute mt-20 w-screen left-1/2 -translate-x-1/2"
          style={{ zIndex: 9, top: '40px' }}
        >
          <div className="relative w-full flex justify-center items-center">
            <div className="relative px-16 py-8" style={{ width: '400px', height: '112px' }}>
              <div className="absolute -left-40 top-1/2 -translate-y-1/2">
                <svg width="200" height="240" viewBox="0 0 200 240" className="overflow-visible">
                  <path
                    d="M30 120 L30 0"
                    fill="none"
                    stroke="#292B2F"
                    strokeWidth="15"
                    strokeLinecap="round"
                  />
                  <path
                    d="M30 120 L200 120"
                    fill="none"
                    stroke="#292B2F"
                    strokeWidth="15"
                    strokeLinecap="round"
                  />
                  <circle cx="200" cy="120" r="6" fill="#292B2F" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Pied vertical du support droit - DERRIÈRE tout - remonte à mi-hauteur */}
        <div
          className="absolute mt-20 w-screen left-1/2 -translate-x-1/2"
          style={{ zIndex: 9, top: '40px' }}
        >
          <div className="relative w-full flex justify-center items-center">
            <div className="relative px-16 py-8" style={{ width: '400px', height: '112px' }}>
              <div className="absolute -right-40 top-1/2 -translate-y-1/2">
                <svg width="200" height="240" viewBox="0 0 200 240" className="overflow-visible">
                  {/* Pied vertical complet - va jusqu'en haut */}
                  <path
                    d="M170 120 L170 0"
                    fill="none"
                    stroke="#292B2F"
                    strokeWidth="15"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ChristmasGarland - niveau intermédiaire */}
        <ChristmasGarland seed="isepbands-christmas-2024" className="top-10 absolute z-20" />

        {/* SignBoard - au-dessus (avec seulement le support droit) */}
        <div className="mt-20 w-screen relative left-1/2 -translate-x-1/2 z-30">
          <SignBoard title="THE CALENDAR" className="-top-16" hideLeftSupport={true} />
        </div>

        <p>ICI CALENDRIER</p>
      </div>

      <h5 className="text-[10px] text-white/70 relative max-w-7xl flex font-press-start-2p justify-center md:justify-end mx-auto pt-8">
        Design de page réalisé par Sarah LEVY
      </h5>
    </main>
  );
}
