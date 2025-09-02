'use client';

import React, { useMemo, useState, useEffect } from 'react';
import ChristmasLightRed from '@/assets/svg/ChristmasLightRed.svg';
import ChristmasLightGreen from '@/assets/svg/ChristmasLightGreen.svg';
import ChristmasLightBlue from '@/assets/svg/ChristmasLightBlue.svg';
import ChristmasLightYellow from '@/assets/svg/ChristmasLightYellow.svg';
import Image from 'next/image';

interface LightAttachment {
  x: number; // Position X en pixels
  y: number; // Position Y en pixels
  id: string;
  rotation: number; // Angle de rotation de la lampe en degrés
  color: 'red' | 'green' | 'blue' | 'yellow'; // Couleur de la lumière
}

// Composant pour afficher une lumière - Les SVG ont déjà leur attache intégrée
const ChristmasLight = ({
  x,
  y,
  rotation,
  color,
  shadowOpacity = 10,
}: {
  x: number;
  y: number;
  rotation: number;
  color: string;
  shadowOpacity?: number;
}) => {
  const lights = {
    red: { svg: ChristmasLightRed, shadow: '#F90004' },
    green: { svg: ChristmasLightGreen, shadow: '#00B618' },
    blue: { svg: ChristmasLightBlue, shadow: '#2500F9' },
    yellow: { svg: ChristmasLightYellow, shadow: '#FFE942' },
  };

  const light = lights[color as keyof typeof lights] || lights.red;

  // Décaler très légèrement en dessous de la guirlande
  const yOffset = -13; // Petit décalage vers le bas pour que l'attache touche la courbe

  return (
    <g transform={`translate(${x}, ${y + yOffset})`}>
      {/* La lumière avec son attache intégrée et ombre qui déborde bien */}
      <foreignObject x="-40" y="-10" width="80" height="80" style={{ overflow: 'visible' }}>
        <div
          style={{
            filter: `drop-shadow(0 0 6px ${light.shadow}${Math.round(shadowOpacity * 255)
              .toString(16)
              .padStart(2, '0')}) drop-shadow(0 0 10px ${light.shadow}${Math.round(
              shadowOpacity * 2 * 255,
            )
              .toString(16)
              .padStart(2, '0')}) drop-shadow(0 0 14px ${light.shadow}${Math.round(
              shadowOpacity * 2 * 255,
            )
              .toString(16)
              .padStart(2, '0')})`,
            width: '80px',
            height: '80px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'visible',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <Image
            src={light.svg}
            alt={`${color} light`}
            width={18}
            height={36}
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center 8px', // Point de rotation au niveau de l'attache
            }}
          />
        </div>
      </foreignObject>
    </g>
  );
};

interface ChristmasGarlandProps {
  seed?: string;
  className?: string;
  shadowOpacity?: number;
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

export default function ChristmasGarland({
  seed = 'isepbands-christmas-2024',
  className = '',
  shadowOpacity = 0.3,
}: ChristmasGarlandProps) {
  const [screenWidth, setScreenWidth] = useState(1024);

  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    updateScreenWidth();
    window.addEventListener('resize', updateScreenWidth);
    return () => window.removeEventListener('resize', updateScreenWidth);
  }, []);

  const { pathData, attachmentPoints, containerHeight, viewBoxWidth, viewBoxHeight } =
    useMemo(() => {
      const hash = simpleHash(seed);
      const rng = new SeededRandom(hash);

      // Paramètres selon la taille d'écran avec BEAUCOUP plus de points
      const isMobile = screenWidth < 768;
      const isTablet = screenWidth >= 768 && screenWidth < 1024;

      // Largeur réelle du conteneur - utilise toute la largeur d'écran
      const containerWidth = screenWidth; // Utilise toujours la largeur complète
      const containerHeight = isMobile ? 50 : isTablet ? 140 : 160; // TRÈS petite sur mobile

      // Plus de points d'ancrage sur mobile pour une belle courbe
      const pointSpacing = isMobile ? 150 : isTablet ? 180 : 150; // Espacement réduit sur mobile pour plus de points
      const anchorCount = Math.max(isMobile ? 6 : 6, Math.floor(containerWidth / pointSpacing)); // Minimum 4 sur mobile

      // Génération des points d'ancrage pour une BELLE GUIRLANDE ALÉATOIRE
      const anchorPoints: { x: number; y: number }[] = [];
      const baseY = containerHeight * 0.35; // Position dans le tiers supérieur
      const amplitude = containerHeight * 0.35; // 35% d'amplitude pour une belle guirlande

      // Générer une courbe vraiment aléatoire mais naturelle
      for (let i = 0; i < anchorCount; i++) {
        const x = (i / (anchorCount - 1)) * containerWidth;

        // Créer une variation plus aléatoire mais naturelle
        let yOffset;
        if (i === 0 || i === anchorCount - 1) {
          // Points d'extrémité plus hauts (attaches)
          yOffset = -amplitude * 0.3 + rng.range(-10, 10);
        } else {
          // Points intermédiaires avec plus de variation
          // Alternance approximative haut/bas avec variation aléatoire
          const baseAlternance = i % 2 === 0 ? -amplitude * 0.2 : amplitude * 0.6;
          yOffset = baseAlternance + rng.range(-amplitude * 0.4, amplitude * 0.4);
        }

        anchorPoints.push({
          x,
          y: baseY + yOffset,
        });
      }

      // Génération d'une courbe ULTRA FLUIDE avec moins de complexité
      // Début depuis le bord gauche
      const firstY = anchorPoints[0].y;
      let bezierPath = `M -10 ${firstY}`;

      // Premier segment vers le premier point
      if (anchorPoints[0].x > 0) {
        const cp1x = anchorPoints[0].x * 0.3;
        const cp2x = anchorPoints[0].x * 0.7;
        bezierPath += ` C ${cp1x} ${firstY}, ${cp2x} ${anchorPoints[0].y}, ${anchorPoints[0].x} ${anchorPoints[0].y}`;
      }

      // Courbes fluides entre les points avec contrôle simple
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

      // Extension fluide jusqu'au bord droit
      const lastPoint = anchorPoints[anchorPoints.length - 1];
      const lastY = lastPoint.y;
      bezierPath += ` C ${lastPoint.x + 50} ${lastY}, ${containerWidth - 50} ${lastY}, ${containerWidth + 10} ${lastY}`;

      // Calcul des points d'attache pour les lumières colorées - PEU mais visibles sur mobile
      const lightSpacing = isMobile ? 80 : isTablet ? 70 : 60; // Espacement réduit sur mobile pour plus de lumières
      const lightCount = Math.floor(containerWidth / lightSpacing);
      const attachments: LightAttachment[] = [];
      const lightColors: ('red' | 'green' | 'blue' | 'yellow')[] = [
        'red',
        'green',
        'blue',
        'yellow',
      ];

      // Alternance stricte des couleurs 1 à 1
      const colorSequence: ('red' | 'green' | 'blue' | 'yellow')[] = [];
      for (let i = 0; i < lightCount; i++) {
        colorSequence.push(lightColors[i % lightColors.length]);
      }

      for (let i = 0; i < lightCount; i++) {
        const x = (i / (lightCount - 1)) * containerWidth;

        // Calculer PRÉCISÉMENT la position Y sur la courbe de Bézier
        let y = baseY;
        let rotation = 0;

        // Gérer les extrémités qui sortent du viewport
        if (x < 0) {
          // Lumière avant le viewport - extrapoler depuis le premier point
          y = anchorPoints[0].y;
          const randomSide = rng.next() > 0.5 ? 1 : -1;
          rotation = rng.range(15, 30) * randomSide;
        } else if (x > containerWidth) {
          // Lumière après le viewport - extrapoler depuis le dernier point
          y = anchorPoints[anchorPoints.length - 1].y;
          const randomSide = rng.next() > 0.5 ? 1 : -1;
          rotation = rng.range(15, 30) * randomSide;
        } else {
          // Trouver le segment correct et interpoler
          let found = false;

          for (let j = 0; j < anchorPoints.length - 1; j++) {
            const start = anchorPoints[j];
            const end = anchorPoints[j + 1];

            if (x >= start.x && x <= end.x) {
              const t = (x - start.x) / (end.x - start.x);

              // Points de contrôle identiques à ceux utilisés pour dessiner la courbe
              const distance = end.x - start.x;
              const cp1x = start.x + distance * 0.4;
              const cp1y = start.y; // Utiliser exactement la même formule
              const cp2x = start.x + distance * 0.6;
              const cp2y = end.y; // Utiliser exactement la même formule

              // Formule de Bézier cubique pour Y - identique au path
              const mt = 1 - t;
              const mt2 = mt * mt;
              const mt3 = mt2 * mt;
              const t2 = t * t;
              const t3 = t2 * t;

              y = mt3 * start.y + 3 * mt2 * t * cp1y + 3 * mt * t2 * cp2y + t3 * end.y;

              // Calcul de la tangente pour la rotation
              // Dérivée de la courbe de Bézier pour obtenir la tangente
              const dx =
                -3 * mt2 * start.x +
                3 * mt2 * cp1x -
                6 * mt * t * cp1x +
                6 * mt * t * cp2x -
                3 * t2 * cp2x +
                3 * t2 * end.x;
              const dy =
                -3 * mt2 * start.y +
                3 * mt2 * cp1y -
                6 * mt * t * cp1y +
                6 * mt * t * cp2y -
                3 * t2 * cp2y +
                3 * t2 * end.y;
              const baseAngle = Math.atan2(dy, dx) * (180 / Math.PI);

              // Rotation aléatoire des deux côtés de la guirlande
              const randomSide = rng.next() > 0.5 ? 1 : -1;
              const randomAngle = rng.range(15, 45);
              rotation = baseAngle + randomAngle * randomSide;
              found = true;
              break;
            }
          }

          // Si pas trouvé (ne devrait pas arriver), utiliser le dernier point connu
          if (!found && anchorPoints.length > 0) {
            // Trouver le point le plus proche
            let closestPoint = anchorPoints[0];
            let minDist = Math.abs(x - anchorPoints[0].x);
            for (const point of anchorPoints) {
              const dist = Math.abs(x - point.x);
              if (dist < minDist) {
                minDist = dist;
                closestPoint = point;
              }
            }
            y = closestPoint.y;
            const randomSide = rng.next() > 0.5 ? 1 : -1;
            rotation = rng.range(15, 35) * randomSide;
          }
        }

        // Utiliser la séquence de couleurs pré-calculée
        const color = colorSequence[i];

        attachments.push({
          x: x,
          y: y,
          id: `light-${i}`,
          rotation: rotation,
          color: color,
        });
      }

      return {
        pathData: bezierPath,
        attachmentPoints: attachments,
        containerHeight,
        viewBoxWidth: containerWidth,
        viewBoxHeight: containerHeight,
      };
    }, [seed, screenWidth]);

  return (
    <div className={`w-full absolute ${className}`} style={{ height: `${containerHeight}px` }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0"
        style={{ overflow: 'visible' }}
      >
        {/* Lumières de Noël - DERRIÈRE la guirlande pour que les ombres passent derrière */}
        {attachmentPoints.map((light) => (
          <ChristmasLight
            key={light.id}
            x={light.x}
            y={light.y}
            rotation={light.rotation}
            color={light.color}
            shadowOpacity={shadowOpacity}
          />
        ))}

        {/* Guirlande principale - DEVANT les lumières */}
        <path
          d={pathData}
          fill="none"
          stroke="#000000"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
