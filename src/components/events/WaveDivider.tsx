'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { cn } from '@/utils/utils';
import Image from 'next/image';

// Import des SVG de notes de musique
import sol from '@/assets/svg/sol.svg';
import note1 from '@/assets/svg/music_notes/note1.svg';
import note2 from '@/assets/svg/music_notes/note2.svg';
import note3 from '@/assets/svg/music_notes/note3.svg';
import note4 from '@/assets/svg/music_notes/note4.svg';
import note5 from '@/assets/svg/music_notes/note5.svg';
import note6 from '@/assets/svg/music_notes/note6.svg';
import note7 from '@/assets/svg/music_notes/note7.svg';
import note8 from '@/assets/svg/music_notes/note8.svg';
import StageLights from '@/components/home/StageLights';

interface WaveDividerProps {
  numberOfWaves?: number;
  backgroundColor?: string;
  previousBackgroundColor?: string;
  height?: number;
  amplitude?: number;
  spacing?: number;
  notesHeight?: number;
  className?: string;
}

interface MusicNote {
  x: number;
  y: number;
  noteType: number;
  color: 'white' | 'purple1' | 'purple2' | 'purple3' | 'purple4';
  opacity: number;
  size: number;
  rotation: number;
}

// Fonction de hash simple pour la génération déterministe (identique à ChristmasGarland)
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Générateur de nombres pseudo-aléatoires déterministe (identique à ChristmasGarland)
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

const musicNotes = [note1, note2, note3, note4, note5, note6, note7, note8];

export default function WaveDivider({
  numberOfWaves = 5,
  backgroundColor = '#f3f4f6',
  previousBackgroundColor = '#ffffff',
  height = 100,
  amplitude = 60,
  spacing = 12,
  notesHeight = 150,
  className = '',
}: WaveDividerProps) {
  const [screenWidth, setScreenWidth] = useState(1024);

  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    updateScreenWidth();
    window.addEventListener('resize', updateScreenWidth);
    return () => window.removeEventListener('resize', updateScreenWidth);
  }, []);

  const {
    pathData,
    containerHeight,
    viewBoxWidth,
    viewBoxHeight,
    totalHeight,
    musicNotePositions,
  } = useMemo(() => {
    const hash = simpleHash(backgroundColor + amplitude.toString());
    const rng = new SeededRandom(hash);

    // Paramètres selon la taille d'écran (comme ChristmasGarland)
    const isMobile = screenWidth < 768;
    const isTablet = screenWidth >= 768 && screenWidth < 1024;

    // Largeur réelle du conteneur (comme ChristmasGarland)
    const containerWidth = isMobile ? Math.min(screenWidth - 20, 500) : screenWidth;
    const containerHeight = height;

    // Points d'ancrage pour la vague (comme dans ChristmasGarland)
    const pointSpacing = isMobile ? 150 : isTablet ? 180 : 150;
    const anchorCount = Math.max(4, Math.floor(containerWidth / pointSpacing));

    // Génération des points d'ancrage pour une belle vague aléatoire
    const anchorPoints: { x: number; y: number }[] = [];
    const baseY = containerHeight * 0.5; // Centre vertical
    const waveAmplitude = amplitude;

    // Générer une courbe vraiment aléatoire mais naturelle (comme ChristmasGarland)
    for (let i = 0; i < anchorCount; i++) {
      const x = (i / (anchorCount - 1)) * containerWidth;

      // Créer une variation beaucoup plus aléatoire et naturelle
      let yOffset;
      if (i === 0 || i === anchorCount - 1) {
        // Points d'extrémité avec plus de variation
        yOffset = rng.range(-waveAmplitude * 0.6, waveAmplitude * 0.6);
      } else {
        // Points intermédiaires avec variation très aléatoire
        yOffset = rng.range(-waveAmplitude * 0.8, waveAmplitude * 0.8);
      }

      anchorPoints.push({
        x,
        y: baseY + yOffset,
      });
    }

    // Génération d'une courbe ULTRA FLUIDE (exactement comme ChristmasGarland)
    const firstY = anchorPoints[0].y;
    let bezierPath = `M -10 ${firstY}`;

    // Premier segment vers le premier point
    if (anchorPoints[0].x > 0) {
      const cp1x = anchorPoints[0].x * 0.3;
      const cp2x = anchorPoints[0].x * 0.7;
      bezierPath += ` C ${cp1x} ${firstY}, ${cp2x} ${anchorPoints[0].y}, ${anchorPoints[0].x} ${anchorPoints[0].y}`;
    }

    // Courbes fluides entre les points avec contrôle simple (identique)
    for (let i = 0; i < anchorPoints.length - 1; i++) {
      const current = anchorPoints[i];
      const next = anchorPoints[i + 1];

      // Points de contrôle simples et réguliers
      const distance = next.x - current.x;
      const cp1x = current.x + distance * 0.4;
      const cp1y = current.y;
      const cp2x = current.x + distance * 0.6;
      const cp2y = next.y;

      bezierPath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }

    // Extension fluide jusqu'au bord droit (identique)
    const lastPoint = anchorPoints[anchorPoints.length - 1];
    const lastY = lastPoint.y;
    bezierPath += ` C ${lastPoint.x + 50} ${lastY}, ${containerWidth - 50} ${lastY}, ${containerWidth + 10} ${lastY}`;

    const totalHeight = containerHeight + (numberOfWaves - 1) * spacing;

    // Fonction pour calculer la position Y de la dernière courbe à un X donné
    const getLastWaveYAtX = (x: number): number => {
      // Trouver le segment correct dans les points d'ancrage
      for (let j = 0; j < anchorPoints.length - 1; j++) {
        const start = anchorPoints[j];
        const end = anchorPoints[j + 1];

        if (x >= start.x && x <= end.x) {
          const t = (x - start.x) / (end.x - start.x);

          // Points de contrôle identiques à ceux utilisés pour dessiner la courbe
          const distance = end.x - start.x;
          const cp1x = start.x + distance * 0.4;
          const cp1y = start.y;
          const cp2x = start.x + distance * 0.6;
          const cp2y = end.y;

          // Formule de Bézier cubique pour Y
          const mt = 1 - t;
          const mt2 = mt * mt;
          const mt3 = mt2 * mt;
          const t2 = t * t;
          const t3 = t2 * t;

          // Position Y de la dernière courbe (avec le décalage)
          const curveY = mt3 * start.y + 3 * mt2 * t * cp1y + 3 * mt * t2 * cp2y + t3 * end.y;
          return curveY + (numberOfWaves - 1) * spacing; // Ajout du décalage de la dernière courbe
        }
      }

      // Si pas trouvé, retourner le centre avec décalage
      return containerHeight * 0.5 + (numberOfWaves - 1) * spacing;
    };

    // Génération des positions des notes de musique le long de la courbe
    const noteSpacing = isMobile ? 120 : isTablet ? 110 : 105; // Espacement augmenté et responsive
    const noteCount = Math.floor(containerWidth / noteSpacing);
    const notes: MusicNote[] = [];

    // Distribution alternée des couleurs pour éviter les clusters
    for (let i = 0; i < noteCount; i++) {
      // Position X régulière le long de la largeur
      const x = noteSpacing / 2 + i * noteSpacing;

      // S'assurer que la note reste dans les limites
      if (x >= 60 && x <= containerWidth - 60) {
        // Calculer la position Y de la dernière courbe à cette position X
        const lastCurveY = getLastWaveYAtX(x);

        // Position Y qui suit la courbe + offset en dessous
        const y = lastCurveY + 60; // 60px en dessous de la courbe

        // Variation légère en X pour un aspect naturel
        const xVariation = rng.range(-3, 3);

        // Alternance simple entre blanc et différentes nuances de violet
        let color: 'white' | 'purple1' | 'purple2' | 'purple3' | 'purple4';
        let opacity: number;

        if (i % 2 === 0) {
          // Notes blanches (une sur deux)
          color = 'white';
          opacity = rng.range(0.8, 1.0);
        } else {
          // Notes violettes avec 4 nuances différentes
          const purpleVariant = Math.floor(rng.next() * 4) + 1;
          color = `purple${purpleVariant}` as 'purple1' | 'purple2' | 'purple3' | 'purple4';

          switch (purpleVariant) {
            case 1: // Violet très clair
              opacity = rng.range(0.7, 0.9);
              break;
            case 2: // Violet clair
              opacity = rng.range(0.6, 0.8);
              break;
            case 3: // Violet moyen
              opacity = rng.range(0.5, 0.7);
              break;
            case 4: // Violet sombre
              opacity = rng.range(0.4, 0.6);
              break;
            default:
              opacity = 0.6;
          }
        }

        notes.push({
          x: x + xVariation,
          y,
          noteType: Math.floor(rng.next() * musicNotes.length),
          color: i === 0 ? 'white' : color,
          opacity: i === 0 ? 1 : opacity,
          size: i === 0 ? rng.range(2.4, 3.0) : rng.range(0.6, 0.9),
          rotation: i === 0 ? rng.range(-30, 30) : rng.range(0, 360),
        });
      }
    }

    return {
      pathData: bezierPath,
      containerHeight,
      viewBoxWidth: containerWidth,
      viewBoxHeight: containerHeight,
      totalHeight,
      musicNotePositions: notes,
    };
  }, [backgroundColor, amplitude, height, spacing, numberOfWaves, notesHeight, screenWidth]);

  return (
    <div className={cn('relative w-full overflow-x-hidden overflow-y-visible', className)}>
      {/* Background coloré pour le reste - NIVEAU 0 */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: `${totalHeight}px`,
          backgroundColor: backgroundColor,
          zIndex: 0,
        }}
      />

      {/* Background du fond précédent qui épouse la forme de la première courbe - NIVEAU 2 */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: `${containerHeight}px`,
          zIndex: 2,
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0"
          style={{ overflow: 'visible' }}
        >
          <path
            d={`M -10 0 L ${viewBoxWidth + 10} 0 L ${viewBoxWidth + 10} ${viewBoxHeight} L -10 ${viewBoxHeight} Z`}
            fill={backgroundColor}
          />
          <path
            d={`${pathData} L ${viewBoxWidth + 10} 0 L -10 0 Z`}
            fill={previousBackgroundColor}
          />
        </svg>
      </div>

      {/* Vagues blanches avec glow - NIVEAU 3+ */}
      {Array.from({ length: numberOfWaves }).map((_, index) => {
        const opacity = index === 0 ? 1 : 0.7 - index * 0.15;
        const yOffset = index * spacing;

        return (
          <div
            key={index}
            className="w-full absolute"
            style={{
              height: `${containerHeight}px`,
              top: `${yOffset}px`,
              zIndex: numberOfWaves - index + 3,
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Effet de glow blanc */}
                <filter id={`whiteGlow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Ligne de vague blanche avec glow */}
              <path
                d={pathData}
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={Math.max(0.1, opacity)}
                filter={`url(#whiteGlow-${index})`}
              />
            </svg>
          </div>
        );
      })}

      {/* Zone des notes de musique avec fond coloré - NIVEAU 9 */}
      <div
        className="absolute inset-x-0"
        style={{
          top: `${totalHeight}px`,
          height: `${notesHeight}px`,
          backgroundColor: backgroundColor,
          zIndex: 9,
        }}
      />

      {/* Notes de musique positionnées dans toute la zone - NIVEAU 10 */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: `${totalHeight + notesHeight}px`,
          zIndex: 10,
        }}
      >
        {musicNotePositions.map((note, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              left: `${(note.x / viewBoxWidth) * 100}%`,
              top: `${note.y}px`,
              transform:
                index === 0
                  ? `translate(-50%, -50%) rotate(-20deg) scale(${note.size})`
                  : `translate(-50%, -50%) rotate(${note.rotation}deg) scale(${note.size})`,
              opacity: index === 0 ? 1 : note.opacity,
              filter:
                note.color === 'white'
                  ? 'brightness(0) saturate(100%) invert(94%) sepia(6%) saturate(1577%) hue-rotate(238deg) brightness(102%) contrast(96%) drop-shadow(0 0 6px rgba(245, 230, 255, 0.7)) drop-shadow(0 0 12px rgba(245, 230, 255, 0.5))'
                  : note.color === 'purple1'
                    ? `brightness(0) saturate(100%) invert(85%) sepia(20%) saturate(300%) hue-rotate(260deg) brightness(95%) contrast(85%) drop-shadow(0 0 6px rgba(200, 180, 220, ${note.opacity * 0.7})) drop-shadow(0 0 12px rgba(200, 180, 220, ${note.opacity * 0.5}))`
                    : note.color === 'purple2'
                      ? `brightness(0) saturate(100%) invert(70%) sepia(35%) saturate(400%) hue-rotate(260deg) brightness(85%) contrast(88%) drop-shadow(0 0 6px rgba(160, 130, 190, ${note.opacity * 0.6})) drop-shadow(0 0 12px rgba(160, 130, 190, ${note.opacity * 0.4}))`
                      : note.color === 'purple3'
                        ? `brightness(0) saturate(100%) invert(50%) sepia(45%) saturate(500%) hue-rotate(260deg) brightness(75%) contrast(90%) drop-shadow(0 0 6px rgba(130, 90, 170, ${note.opacity * 0.6})) drop-shadow(0 0 12px rgba(130, 90, 170, ${note.opacity * 0.4}))`
                        : `brightness(0) saturate(100%) invert(30%) sepia(55%) saturate(600%) hue-rotate(260deg) brightness(65%) contrast(92%) drop-shadow(0 0 6px rgba(100, 60, 140, ${note.opacity * 0.6})) drop-shadow(0 0 12px rgba(100, 60, 140, ${note.opacity * 0.4}))`,
              pointerEvents: 'none',
            }}
          >
            <Image
              src={index === 0 ? sol : musicNotes[note.noteType]}
              alt={index === 0 ? 'Note sol' : `Note de musique ${note.noteType + 1}`}
              width={100}
              height={100}
              className={
                index === 0
                  ? 'w-auto h-auto max-w-[150px] max-h-[150px]'
                  : 'w-auto h-auto max-w-[50px] max-h-[50px]'
              }
            />
          </div>
        ))}
      </div>

      {/* Spacer pour la hauteur totale incluant les notes */}
      <div
        style={{
          height: `${totalHeight + notesHeight}px`,
        }}
        className="relative z-[-1]"
      />
    </div>
  );
}
