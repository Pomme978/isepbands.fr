'use client';

import React, { useState, useEffect } from 'react';

interface SignBoardProps {
  title: string;
  className?: string;
  hideSupports?: boolean;
  hideLeftSupport?: boolean;
  hideRightSupport?: boolean;
}

export default function SignBoard({
  title,
  className = '',
  hideSupports = false,
  hideLeftSupport = false,
  hideRightSupport = false,
}: SignBoardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 384, height: 112 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateDimensions = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setDimensions({
        width: mobile ? 288 : 384, // w-72 vs w-96
        height: mobile ? 96 : 112, // h-24 vs h-28
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  return (
    <div
      className={`relative w-full flex justify-center items-center ${className}`}
      style={{ overflow: 'visible' }}
    >
      {/* Panneau principal */}
      <div
        className="relative px-8 md:px-16 py-4 md:py-8 rounded-lg shadow-2xl w-72 md:w-96 h-24 md:h-28"
        style={{ backgroundColor: '#292B2F' }}
      >
        {/* Supports/Attaches sur les côtés du panneau */}
        {!hideSupports && (
          <>
            {/* Support gauche - DERRIÈRE la guirlande */}
            {!hideLeftSupport && (
              <div
                className="absolute -left-10 md:-left-40 top-1/2 -translate-y-1/2"
                style={{ zIndex: 10 }}
              >
                <svg
                  width="160"
                  height="200"
                  viewBox="0 0 160 200"
                  className="md:w-[200px] md:h-[240px] md:[viewBox:0_0_200_240] overflow-visible"
                >
                  {/* Pied vertical qui monte très haut */}
                  <path
                    d="M24 96 L24 0"
                    fill="none"
                    stroke="#292B2F"
                    strokeWidth="12"
                    strokeLinecap="round"
                    className=""
                  />
                  {/* Bras horizontal vers le panneau */}
                  <path
                    d="M24 96 L160 96"
                    fill="none"
                    stroke="#292B2F"
                    strokeWidth="12"
                    strokeLinecap="round"
                    className=""
                  />
                </svg>
              </div>
            )}

            {/* Support droit - avec pied vertical + bras horizontal - DEVANT la guirlande */}
            {!(hideRightSupport && mounted && isMobile) && (
              <div
                className="absolute -right-10 md:-right-43 top-1/2 -translate-y-1/2"
                style={{ zIndex: 7 }}
              >
                <svg
                  width="160"
                  height="200"
                  viewBox="0 0 160 200"
                  className="md:w-[200px] md:h-[240px] md:[viewBox:0_0_200_240] overflow-visible"
                >
                  {/* Pied vertical qui remonte - court */}
                  <path
                    d="M136 96 L136 28"
                    fill="none"
                    stroke="#292B2F"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {/* Bras horizontal vers le panneau - AU-DESSUS de la guirlande */}
                  <path
                    d="M136 96 L0 96"
                    fill="none"
                    stroke="#292B2F"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}
          </>
        )}

        {/* Boules de lumières dans les coins et sur les bords - AU-DESSUS des supports */}
        {mounted && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 50 }}>
            {(() => {
              // Utiliser les dimensions du state React
              const panelWidth = dimensions.width;
              const panelHeight = dimensions.height;
              const margin = 12; // Marge plus grande pour éviter les débordements

              // Espacement plus conservateur pour éviter les débordements
              const bulbSpacing = isMobile ? 20 : 24; // Plus d'espace entre les boules
              const horizontalCount = Math.floor((panelWidth - 2 * margin) / bulbSpacing) + 1;
              const verticalCount = Math.floor((panelHeight - 2 * margin) / bulbSpacing) + 1;

              const bulbs = [];

              // Générer TOUTES les positions de la grille avec positionnement aux bords
              for (let row = 0; row < verticalCount; row++) {
                for (let col = 0; col < horizontalCount; col++) {
                  // Calculer la position exacte pour cette grille
                  let x, y;

                  // Position X : première et dernière colonne aux bords exacts
                  if (col === 0) {
                    x = margin;
                  } else if (col === horizontalCount - 1) {
                    x = panelWidth - margin;
                  } else {
                    x =
                      margin + (col * (panelWidth - 2 * margin)) / Math.max(1, horizontalCount - 1);
                  }

                  // Position Y : première et dernière rangée aux bords exacts
                  if (row === 0) {
                    y = margin;
                  } else if (row === verticalCount - 1) {
                    y = panelHeight - margin;
                  } else {
                    y =
                      margin + (row * (panelHeight - 2 * margin)) / Math.max(1, verticalCount - 1);
                  }

                  // Déterminer si c'est un bord (pour afficher la boule)
                  const isTopRow = row === 0;
                  const isBottomRow = row === verticalCount - 1;
                  const isLeftCol = col === 0;
                  const isRightCol = col === horizontalCount - 1;
                  const isEdge = isTopRow || isBottomRow || isLeftCol || isRightCol;

                  if (isEdge) {
                    bulbs.push(
                      <div
                        key={`bulb-${row}-${col}`}
                        className="absolute w-3 h-3 rounded-full"
                        style={{
                          left: `${x - 6}px`,
                          top: `${y - 6}px`,
                          background:
                            'radial-gradient(ellipse 50.00% 50.00% at 50.00% 50.00%, white 43%, #FFE874 59%, rgba(255, 207.53, 173.63, 0) 100%)',
                          boxShadow: '0 0 12px #FFE3CC, 0 0 20px #FFE3CC',
                          filter: 'blur(1px)',
                          animation: `twinkle ${3 + (row + col) * 0.1}s ease-in-out infinite alternate`,
                        }}
                      />,
                    );
                  }
                }
              }

              return bulbs;
            })()}
          </div>
        )}

        {/* Titre */}
        <h2
          className="text-sm md:text-lg lg:text-xl xl:text-2xl font-bold text-white text-center font-press-start-2p leading-tight relative flex items-center justify-center w-full h-full"
          style={{ zIndex: 50 }}
        >
          {title.includes(' ') ? (
            <>
              {title.split(' ')[0]}
              <br />
              {title.split(' ').slice(1).join(' ')}
            </>
          ) : (
            title
          )}
        </h2>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0% {
            opacity: 0.6;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            opacity: 0.8;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
