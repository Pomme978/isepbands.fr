'use client';

import EventsScroller from '@/components/events/EventsScroller';
import GridBackground from '@/components/events/GridBackground';
import EventPosters from '@/components/events/EventPosters';
import ChristmasGarland from '@/components/events/ChristmasGarland';
import SignBoard from '@/components/events/SignBoard';
import Calendar from '@/components/events/Calendar';
import WaveDivider from '@/components/events/WaveDivider';
import { useIsMobile } from '@/hooks/useIsMobile';
import React from 'react';
import Image from 'next/image';
import leftMonitor from '@/assets/svg/left_monitor.svg';
import rightMonitor from '@/assets/svg/right_monitor.svg';
import underline from '@/assets/svg/underline.svg';
import PolaroidStack from '@/components/events/PolaroidStack';
import DecoratedTitle from '@/components/events/DecoratedTitle';
import botb1 from '@/assets/images/events/botb2_1.jpg';
import botb2 from '@/assets/images/events/botb2_2.jpg';
import botb3 from '@/assets/images/events/botb2_3.jpg';
import botb4 from '@/assets/images/events/botb2_4.jpg';
import StageLights from '@/components/home/StageLights';

export default function EventsPage() {
  const isMobile = useIsMobile();

  // Données mockup pour les événements
  const mockEvents = [
    { id: '1', text: 'Next Jam This Saturday at 6pm * NDL * With your group : "the f(l)avors"' },
    { id: '2', text: 'Concert Rock Night - Friday 8pm * Amphi 1 * Open Mic Session' },
    { id: '3', text: 'Band Rehearsal - Monday 7pm * Studio B * All Members Welcome' },
    { id: '4', text: 'Music Workshop - Wednesday 6pm * Room 202 * Guitar Masterclass' },
  ];

  // Images pour le PolaroidStack
  const polaroidImages = [botb1, botb2, botb3, botb4];

  return (
    <main className="min-h-screen">
      <div className="w-full h-80 md:h-100 flex md:mt-0 mt-10 justify-center items-center flex-col relative">
        <div className="flex items-center justify-center gap-8 md:gap-16">
          {/* Title with underline */}
          <div className="flex flex-col items-center">
            <h1
              className="font-normal font-monoton text-5xl md:text-8xl leading-none text-white text-center"
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
          </div>
        </div>

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
      <div className="relative w-full -top-23 min-h-100 flex justify-center items-center flex-col bg-[#19192B]">
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

        <div className="mt-0 md:mt-16 px-8 relative overflow-x-hidden overflow-y-visible">
          <div className="relative z-10">
            <Calendar />
          </div>
        </div>

        {/* Séparateur avec vagues */}
        <WaveDivider
          numberOfWaves={5}
          backgroundColor="#2D0446"
          previousBackgroundColor="#19192B"
          height={120}
          amplitude={60}
          spacing={12}
          className="mt-20 relative"
        />

        <div className="relative bg-[#2D0446] w-full py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
            <div className="flex flex-row justify-between items-center gap-4 md:gap-8">
              {/* Left Monitor */}
              <Image
                src={leftMonitor}
                alt="Left Monitor"
                width={isMobile ? 80 : 150}
                height={isMobile ? 80 : 150}
                className="flex-shrink-0"
              />

              {/* Title with underline */}
              <div className="flex flex-col items-center flex-1">
                <h1 className="text-white font-bold text-2xl md:text-5xl text-center leading-tight">
                  NOS ÉVÉNEMENTS PHARES
                </h1>
                <Image
                  src={underline}
                  alt="Underline"
                  width={isMobile ? 200 : 400}
                  height={20}
                  className="mt-2 md:mt-4"
                />
              </div>

              {/* Right Monitor */}
              <Image
                src={rightMonitor}
                alt="Right Monitor"
                width={isMobile ? 80 : 150}
                height={isMobile ? 80 : 150}
                className="flex-shrink-0"
              />
            </div>

            {/* PolaroidStack Section */}
            <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-center justify-between max-w-7xl">
              <div className="flex justify-center w-full md:w-auto px-4 md:px-8">
                <PolaroidStack images={polaroidImages} seed="isepbands-events-2024" />
              </div>
              <div className="bg-[#715184]/50 rounded-lg p-4 md:p-6 max-w-2xl w-full md:w-auto">
                <h2
                  className="text-white font-bold text-lg md:text-xl lg:text-2xl text-center lg:text-right mb-3 md:mb-4"
                  style={{
                    filter:
                      'drop-shadow(2px 2px 4px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 8px rgba(255, 255, 255, 0.2))',
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                  }}
                >
                  CONCERT MI-ANNUEL
                </h2>
                <p className="text-white text-sm md:text-base text-justify leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id lobortis purus.
                  Vivamus sed varius risus. Sed a purus sit amet nisl feugiat mollis. Nullam
                  dignissim, dolor sit amet hendrerit blandit, erat est efficitur mi, quis egestas
                  odio dui sit amet orci. Sed pulvinar, lorem vitae convallis blandit, turpis massa
                  sagittis ex, vitae interdum metus elit et sapien. Nam eget felis scelerisque
                  libero fringilla venenatis. Ut elementum vel enim eu pellentesque. Pellentesque
                  tincidunt iaculis velit, eu condimentum lorem cursus in. Vestibulum semper ex eu
                  mi venenatis, a dictum sem elementum. Suspendisse potenti. Duis in nisi sodales,
                  placerat velit vitae, rhoncus metus. Curabitur in suscipit sem, nec posuere
                  tellus. Ut sed enim turpis. Nulla iaculis risus in tempor cursus.
                </p>
              </div>
            </div>
          </div>
          <DecoratedTitle title="FÊTE DE LA MUSIQUE" className="mb-3 md:mb-4" />
        </div>
      </div>

      <h5 className="text-[10px] text-white/70 relative max-w-7xl flex font-press-start-2p justify-center md:justify-end mx-auto pt-8">
        Design de page réalisé par Sarah LEVY
      </h5>
    </main>
  );
}
