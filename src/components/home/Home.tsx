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
            <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-8 z-20">
              {t('page.home.about.title')}
            </h1>
            <p className="text-gray-700 text-md mt-4 text-center max-w-2xl z-20">
              {t('page.home.about.description1')}
            </p>
            <p className="text-gray-700 text-md text-center mb-6 mt-5 max-w-2xl z-20">
              {t('page.home.about.description2')}
            </p>

            <Button asChild className="mb-12">
              <LangLink href={`/${lang}/club`}>{t('page.home.about.learnMore')}</LangLink>
            </Button>
          </div>
          <OurFamousEvents />
          {/* Call to Action (reste dans page.tsx) */}
          {!user && (
            <div className="text-center mb-16 py-12 w-full bg-white rounded-xl">
              <div className="flex flex-col md:flex-row items-center justify-between mx-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
                  {t('page.home.cta.title')}
                </h2>
                <Button asChild className="bg-primary text-white px-8 py-3">
                  <LangLink href="/#comment-nous-rejoindre">{t('page.home.cta.button')}</LangLink>
                </Button>
              </div>
            </div>
          )}

          {/* Divider */}
          <hr className="border-gray-300 mb-16" />

          {/* Upcoming Events Section - Commented out */}
          <div className="w-full text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {t('page.home.events.upcoming.title')}
            </h2>
            <p className="text-xs text-gray-500 py-12">
              {t('page.home.events.upcoming.comingSoon')}
            </p>
          </div>
          {/* <UpcomingEvents /> */}
        </div>
      </div>
    </>
  );
}
