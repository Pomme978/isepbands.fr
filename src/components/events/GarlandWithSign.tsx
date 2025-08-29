'use client';

import React from 'react';
import ChristmasGarland from './ChristmasGarland';
import SignBoard from './SignBoard';

interface GarlandWithSignProps {
  garlandSeed?: string;
  garlandClassName?: string;
  signTitle: string;
  signClassName?: string;
}

// Composant pour un support isolé - positionné par rapport au SignBoard
export const SignSupport = ({ side, zIndex }: { side: 'left' | 'right'; zIndex: number }) => {
  const isLeft = side === 'left';

  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? '-left-40' : '-right-40'}`}
      style={{
        zIndex: zIndex,
        pointerEvents: 'none',
      }}
    >
      <svg width="200" height="240" viewBox="0 0 200 240" className="overflow-visible">
        {/* Pied vertical qui monte très haut */}
        <path
          d={isLeft ? 'M30 120 L30 0' : 'M170 120 L170 0'}
          fill="none"
          stroke="#292B2F"
          strokeWidth="15"
          strokeLinecap="round"
        />
        {/* Bras horizontal vers le panneau */}
        <path
          d={isLeft ? 'M30 120 L200 120' : 'M170 120 L0 120'}
          fill="none"
          stroke="#292B2F"
          strokeWidth="15"
          strokeLinecap="round"
        />
        {/* Attache au panneau */}
        <circle cx={isLeft ? '200' : '0'} cy="120" r="6" fill="#292B2F" />
      </svg>
    </div>
  );
};

export default function GarlandWithSign({
  garlandSeed = 'isepbands-christmas-2024',
  garlandClassName = '',
  signTitle,
  signClassName = '',
}: GarlandWithSignProps) {
  return (
    <div className="relative w-full">
      {/* ChristmasGarland - niveau intermédiaire */}
      <div style={{ zIndex: 30, position: 'relative' }}>
        <ChristmasGarland seed={garlandSeed} className={garlandClassName} />
      </div>

      {/* SignBoard avec supports repositionnés avec z-index différents */}
      <div style={{ zIndex: 50, position: 'relative' }}>
        <div className="relative w-full flex justify-center items-center">
          <div
            className="relative px-16 py-8 rounded-lg shadow-2xl"
            style={{ backgroundColor: '#292B2F', width: '400px' }}
          >
            {/* Support gauche - DERRIÈRE la guirlande */}
            <SignSupport side="left" zIndex={20} />

            {/* Support droit - DEVANT la guirlande */}
            <SignSupport side="right" zIndex={40} />

            {/* Boules et contenu du SignBoard */}
            <SignBoard title={signTitle} className={signClassName} hideSupports={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
