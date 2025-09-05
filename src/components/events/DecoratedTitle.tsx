'use client';

import React from 'react';
import Image from 'next/image';
import sol from '@/assets/svg/sol.svg';

interface DecoratedTitleProps {
  title: string;
  className?: string;
}

export default function DecoratedTitle({ title, className = '' }: DecoratedTitleProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Clés de sol à gauche */}
      <div className="relative hidden md:block w-32 h-16">
        {Array.from({ length: 4 }, (_, i) => {
          const rotation = -(i + 1) * 15;
          const blur = 0.5 + i;
          const offsetX = i * 30;

          return (
            <Image
              key={`left-${i}`}
              src={sol}
              alt=""
              width={40}
              height={40}
              className="absolute opacity-60"
              style={{
                right: offsetX,
                filter: `blur(${blur}px)`,
                top: '50%',
                transform: `rotate(${rotation}deg) translateY(-50%)`,
                zIndex: 10 - i,
              }}
            />
          );
        })}
      </div>

      {/* Titre principal avec drop shadow */}
      <h2
        className="text-white font-bold text-xl md:text-2xl lg:text-3xl text-center mx-4 md:mx-8 px-4"
        style={{
          filter:
            'drop-shadow(2px 2px 4px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 8px rgba(255, 255, 255, 0.2))',
          textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
        }}
      >
        {title}
      </h2>

      {/* Clés de sol à droite (miroir) */}
      <div className="relative hidden md:block w-32 h-16">
        {Array.from({ length: 4 }, (_, i) => {
          const rotation = -(i + 1) * 15;
          const blur = 0.5 + i;
          const offsetX = i * 30;

          return (
            <Image
              key={`right-${i}`}
              src={sol}
              alt=""
              width={40}
              height={40}
              className="absolute opacity-60"
              style={{
                left: offsetX,
                filter: `blur(${blur}px)`,
                top: '50%',
                transform: `scaleX(-1) rotate(${rotation}deg) translateY(-50%)`,
                zIndex: 10 - i,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
