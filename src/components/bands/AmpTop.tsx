'use client';

import Image from 'next/image';
import ampButtons from '@/assets/svg/amp_buttons.svg';

export default function AmpTop() {
  return (
    <div className="relative w-full md:mt-8 mt-4 md:mt-12">
      {/* Div de fond gris pour le top de l'ampli */}
      <div className="w-full h-45 md:h-40" style={{ backgroundColor: '#353945' }}>
        {/* Bordure supérieure - Full width mobile, rounded desktop */}
        <div
          className="absolute md:-top-1 left-0 right-0 h-2 md:h-3 -translate-y-1/2"
          style={{
            backgroundColor: '#525766',
          }}
        >
          <style jsx>{`
            @media (min-width: 768px) {
              div {
                border-radius: 100px 100px 0 0 / 10px 10px 0 0;
              }
            }
          `}</style>
        </div>

        {/* Div jaune central - Full width mobile, max-w-5xl desktop */}
        <div
          className="absolute left-0 md:left-1/2 md:-translate-x-1/2 flex justify-center items-center px-4 md:px-8"
          style={{
            backgroundColor: '#F4B723',
            top: '30px',
            bottom: '0',
            width: '100%',
            borderTop: '10px solid #A8750F',
            borderBottom: '6px solid #DEC133',
          }}
        >
          <style jsx>{`
            @media (min-width: 768px) {
              div {
                width: calc(100% - 2rem);
                max-width: 64rem;
                border-radius: 80px 80px 0 0 / 16px 16px 0 0;
              }
            }
          `}</style>
          
          {/* Ligne de bordure inférieure */}
          
          {/* Contenu - Desktop */}
          <div className="hidden md:flex w-full justify-between items-center px-0 max-w-5xl">
            <h1 className="text-5xl lg:text-6xl font-black text-white">OUR</h1>
            <Image src={ampButtons} alt="Amp Buttons" className="h-16 lg:h-20 w-auto" priority />
            <h1 className="text-5xl lg:text-6xl font-black text-white">BANDS</h1>
          </div>

          {/* Contenu - Mobile */}
          <div className="flex md:hidden flex-col items-center justify-center w-full">
            <Image src={ampButtons} alt="Amp Buttons" className="h-16 w-auto mb-2" priority />
            <h1 className="text-5xl font-black text-white">OUR BANDS</h1>
          </div>
        </div>
      </div>
    </div>
  );
}