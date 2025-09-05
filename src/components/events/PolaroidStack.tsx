'use client';

import React, { useState, useMemo } from 'react';
import Image, { StaticImageData } from 'next/image';
import grainPaper from '@/assets/images/grain_paper.png';
import yellowPin from '@/assets/svg/yellow_pin.svg';

interface PolaroidStackProps {
  images: StaticImageData[];
  seed?: string;
}

// Fonction de hash simple pour la génération déterministe
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Générateur de nombres pseudo-aléatoires déterministe
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

export default function PolaroidStack({ images, seed = 'polaroid-stack' }: PolaroidStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Générer les rotations de manière déterministe
  const cardRotations = useMemo(() => {
    const hash = simpleHash(seed);
    const rng = new SeededRandom(hash);

    return images.map((_, index) => {
      if (index === 0) {
        // Première carte : rotation légère (-20 à 20 degrés)
        return rng.range(-20, 20);
      } else {
        // Cartes derrière : rotation plus importante pour l'effet stack
        return rng.range(-35, 35);
      }
    });
  }, [images, seed]);

  // Gérer les translations pour l'effet stack
  const getCardTransform = (index: number) => {
    const relativeIndex = (index - currentIndex + images.length) % images.length;
    const rotation = cardRotations[index];

    if (relativeIndex === 0) {
      // Carte active (au-dessus)
      return {
        zIndex: images.length,
        transform: `rotate(${rotation}deg) translate(0, 0)`,
        cursor: 'default',
      };
    } else {
      // Cartes derrière
      const offsetX = relativeIndex * 8; // Décalage horizontal
      const offsetY = relativeIndex * -5; // Décalage vertical
      return {
        zIndex: images.length - relativeIndex,
        transform: `rotate(${rotation}deg) translate(${offsetX}px, ${offsetY}px)`,
        cursor: 'pointer',
      };
    }
  };

  const handleCardClick = (index: number) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto" style={{ height: '500px' }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative" style={{ width: '320px', height: '320px' }}>
          {images.map((image, index) => {
            const { zIndex, transform, cursor } = getCardTransform(index);
            const isActive = index === currentIndex;

            return (
              <div
                key={index}
                onClick={() => handleCardClick(index)}
                className="absolute bg-white rounded-md p-2 pb-8 transition-all duration-500 ease-in-out"
                style={{
                  top: '50%',
                  left: '50%',
                  zIndex,
                  transform: `translate(0, -50%) ${transform}`,
                  cursor,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 5px 15px rgba(0, 0, 0, 0.2)',
                  width: '320px',
                  height: '360px',
                }}
              >
                {/* Pin jaune sur la première carte visible */}
                {isActive && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                    <Image
                      src={yellowPin}
                      alt="Pin"
                      width={40}
                      height={40}
                      className="drop-shadow-md"
                    />
                  </div>
                )}

                {/* Container de la photo avec effet grain */}
                <div
                  className="relative w-full overflow-hidden rounded-sm"
                  style={{ aspectRatio: '1/1' }}
                >
                  {/* Photo */}
                  <Image
                    src={image}
                    alt={`Polaroid ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />

                  {/* Effet grain en overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <Image
                      src={grainPaper}
                      alt="Grain effect"
                      fill
                      className="object-cover mix-blend-exclusion opacity-30"
                      sizes="(max-width: 768px) 100vw, 320px"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Indicateurs de navigation
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
      */}
    </div>
  );
}
