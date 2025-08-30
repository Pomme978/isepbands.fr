'use client';

import AmpTop from '@/components/bands/AmpTop';
import AmpContent from '@/components/bands/AmpContent';
import AmpTweeter from '@/components/bands/AmpTweeter';
import AmpBottom from '@/components/bands/AmpBottom';
import GuitarWithCable from '@/components/bands/GuitarWithCable';

export default function BandsPage() {
  return (
    <main className="min-h-screen">
      <AmpTop />
      <AmpContent>
        <div className="max-w-xl text-center text-gray-800">
          <h2 className="text-2xl font-black">WHAT IS A BAND ?</h2>
          <p className="mt-4 text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id lobortis purus. Vivamus
            sed varius risus. Sed a purus sit amet nisl feugiat mollis. Nullam dignissim, dolor sit
            amet hendrerit blandit, erat est efficitur mi, quis egestas odio dui sit amet orci. Sed
            pulvinar, lorem vitae convallis blandit, turpis massa sagittis ex, vitae interdum metus
            elit et sapien.{' '}
          </p>
        </div>
        <AmpTweeter />
        <div className="max-w-xl text-center text-gray-800">
          <h2 className="text-2xl font-black">WHY CARING TO JOIN A BAND ?</h2>
          <p className="mt-4 text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id lobortis purus. Vivamus
            sed varius risus. Sed a purus sit amet nisl feugiat mollis. Nullam dignissim, dolor sit
            amet hendrerit blandit, erat est efficitur mi, quis egestas odio dui sit amet orci. Sed
            pulvinar, lorem vitae convallis blandit, turpis massa sagittis ex, vitae interdum metus
            elit et sapien.{' '}
          </p>
        </div>
      </AmpContent>
      <AmpBottom />
      <div className="h-300"></div>
    </main>
  );
}
