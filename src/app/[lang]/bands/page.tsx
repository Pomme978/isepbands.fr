'use client';

import AmpTop from '@/components/bands/AmpTop';
import AmpContent from '@/components/bands/AmpContent';
import AmpTweeter from '@/components/bands/AmpTweeter';
import AmpBottom from '@/components/bands/AmpBottom';
import GuitarWithCable from '@/components/bands/GuitarWithCable';
import { useI18n } from '@/locales/client';

export default function BandsPage() {
  const t = useI18n();

  return (
    <main className="min-h-screen">
      <AmpTop />
      <AmpContent>
        <div className="max-w-xl text-center text-gray-800">
          <h2 className="text-2xl font-black">{t('page.bands.whatIsABand.title')}</h2>
          <p className="mt-4 text-base">{t('page.bands.whatIsABand.description')}</p>
        </div>
        <AmpTweeter />
        <div className="max-w-xl text-center text-gray-800">
          <h2 className="text-2xl font-black">{t('page.bands.whyJoinABand.title')}</h2>
          <p className="mt-4 text-base">{t('page.bands.whyJoinABand.description')}</p>
        </div>
      </AmpContent>
      <AmpBottom />
      <div className="h-300"></div>
    </main>
  );
}
