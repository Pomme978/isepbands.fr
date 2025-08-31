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
        <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center items-center flex-col">
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-10 z-20">WHO ARE WE?</h1>
            <p className="text-gray-700 text-md mt-4 text-center mb-6 max-w-2xl z-20">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id lobortis purus.
              Vivamus sed varius risus. Sed a purus sit amet nisl feugiat mollis. Nullam dignissim,
              dolor sit amet hendrerit blandit, erat est efficitur mi, quis egestas odio dui sit
              amet orci. Sed pulvinar, lorem vitae convallis blandit, turpis massa sagittis ex,
              vitae interdum metus elit et sapien. Nam eget felis scelerisque libero fringilla
              venenatis. Ut elementum vel enim eu pellentesque. Pellentesque tincidunt iaculis
              velit, eu condimentum lorem cursus in. Vestibulum semper ex eu mi venenatis, a dictum
              sem elementum. Suspendisse potenti. Duis in nisi sodales, placerat velit vitae,
              rhoncus metus. Curabitur in suscipit sem, nec posuere tellus. Ut sed enim turpis.
              Nulla iaculis risus in tempor cursus.
            </p>

            <Button asChild className="mb-12">
              <LangLink href={`/${lang}/asso`}>Learn More</LangLink>
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
                  <LangLink href="/club#adhesion">Join Us</LangLink>
                </Button>
              </div>
            </div>
          )}

          {/* Divider */}
          <hr className="border-gray-300 mb-16" />

          <UpcomingEvents />
        </div>
      </div>
    </>
  );
}
