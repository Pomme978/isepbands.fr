'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useI18n } from '@/locales/client';
import LangLink from '@/components/common/LangLink';
import OurFamousEvents from '@/components/home/OurFamousEvents';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import { useSession } from '@/lib/auth-client';

import purpleGuitar from '@/assets/images/instruments/purple_guitar.png';
import synth from '@/assets/images/instruments/synth.png';

interface HomeProps {
  lang: string;
}

export function Home({ lang }: HomeProps) {
  const t = useI18n();
  const { user } = useSession();

  return (
    <>
      <div className="relative bg-gray-100 w-full">
        <div className="max-w-7xl mx-auto px-2 pb-8 flex justify-center items-center flex-col">
          <div className="flex items-center justify-center flex-col">
            {/* Left floating guitar */}
            <div className="absolute -left-30 top-20 z-10 hidden lg:inline">
              <Image
                src={purpleGuitar}
                alt="Purple Guitar"
                className={'w-60 h-auto -rotate-20'}
                priority={false}
              />
            </div>

            {/* Right floating synth */}
            <div className="absolute -right-30 top-40 z-10 hidden lg:inline">
              <Image
                src={synth}
                alt="Synthesizer"
                className="w-60 h-auto rotate-25"
                priority={false}
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-8 z-20">QUI SOMMES-NOUS?</h1>
            <p className="text-gray-700 text-md mt-4 text-center max-w-2xl z-20">
              Chez ISEPBands, la musique ne s’arrête jamais. Notre association réunit les étudiants
              passionnés, débutants comme confirmés, autour de jams, de concerts et de projets de
              groupe. Ici, chacun trouve sa place : que tu veuilles simplement jouer pour le
              plaisir, progresser avec d’autres musiciens, ou monter sur scène, on t’accompagne.
            </p>
            <p className="text-gray-700 text-md text-center mb-6 mt-5 max-w-2xl z-20">
              Notre mission : créer un espace convivial où la créativité et l’énergie de la musique
              live se partagent sans limite.
            </p>

            <Button asChild className="mb-12">
              <LangLink href={`/${lang}/club`}>En savoir plus</LangLink>
            </Button>
          </div>
          <OurFamousEvents />
          {/* Call to Action (reste dans page.tsx) */}
          {!user && (
            <div className="text-center mb-16 py-12 w-full bg-white rounded-xl">
              <div className="flex flex-col md:flex-row items-center justify-between mx-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
                  SO IF YOU&#39;RE READY, WHAT ARE YOU WAITING FOR ?
                </h2>
                <Button asChild className="bg-primary text-white px-8 py-3">
                  <LangLink href="/#comment-nous-rejoindre">Join Us</LangLink>
                </Button>
              </div>
            </div>
          )}

          {/* Divider */}
          <hr className="border-gray-300 mb-16" />

          {/* Upcoming Events Section - Commented out */}
          <div className="w-full text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">UPCOMING EVENTS</h2>
            <p className="text-xs text-gray-500 py-12">Fonctionnalité à venir</p>
          </div>
          {/* <UpcomingEvents /> */}
        </div>
      </div>
    </>
  );
}
