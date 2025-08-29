'use client';

import React from 'react';

interface SignBoardProps {
  title: string;
  className?: string;
  hideSupports?: boolean;
  hideLeftSupport?: boolean;
}

export default function SignBoard({
  title,
  className = '',
  hideSupports = false,
  hideLeftSupport = false,
}: SignBoardProps) {
  return (
    <div
      className={`relative w-full flex justify-center items-center ${className}`}
      style={{ overflow: 'visible' }}
    >
      {/* Panneau principal */}
      <div
        className="relative px-16 py-8 rounded-lg shadow-2xl"
        style={{
          backgroundColor: '#292B2F',
          width: '400px',
          height: `${16 + 5 * 18 + 8}px`, // 2*margin + (5 intervalles pour 6 rangées) + léger padding
        }}
      >
        {/* Supports/Attaches sur les côtés du panneau */}
        {!hideSupports && (
          <>
            {/* Support gauche - DERRIÈRE la guirlande */}
            {!hideLeftSupport && (
              <div className="absolute -left-40 top-1/2 -translate-y-1/2" style={{ zIndex: 10 }}>
                <svg width="200" height="240" viewBox="0 0 200 240" className="overflow-visible">
                  {/* Pied vertical qui monte très haut */}
                  <path
                    d="M30 120 L30 0"
                    fill="none"
                    stroke="#292B2F"
                    strokeWidth="15"
                    strokeLinecap="round"
                  />
                  {/* Bras horizontal vers le panneau */}
                  <path
                    d="M30 120 L200 120"
                    fill="none"
                    stroke="#292B2F"
                    strokeWidth="15"
                    strokeLinecap="round"
                  />
                  {/* Attache au panneau */}
                  <circle cx="200" cy="120" r="6" fill="#292B2F" />
                </svg>
              </div>
            )}

            {/* Support droit - avec pied vertical + bras horizontal - DEVANT la guirlande */}
            <div className="absolute -right-40 top-1/2 -translate-y-1/2" style={{ zIndex: 25 }}>
              <svg width="200" height="240" viewBox="0 0 200 240" className="overflow-visible">
                {/* Pied vertical qui remonte - court */}
                <path
                  d="M170 120 L170 60"
                  fill="none"
                  stroke="#292B2F"
                  strokeWidth="15"
                  strokeLinecap="round"
                />
                {/* Bras horizontal vers le panneau - AU-DESSUS de la guirlande */}
                <path
                  d="M170 120 L0 120"
                  fill="none"
                  stroke="#292B2F"
                  strokeWidth="15"
                  strokeLinecap="round"
                />
                {/* Attache au panneau */}
                <circle cx="0" cy="120" r="6" fill="#292B2F" />
              </svg>
            </div>
          </>
        )}

        {/* Boules de lumières dans les coins et sur les bords - AU-DESSUS des supports */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 50 }}
          ref={(el) => {
            if (el) {
              // Calcul dynamique de la hauteur réelle du panneau
              const realHeight = el.parentElement?.offsetHeight || 112;
              el.setAttribute('data-height', realHeight.toString());
            }
          }}
        >
          {(() => {
            const panelWidth = 400;
            const margin = 8;

            // Calcul dynamique de la hauteur réelle
            const panelElement = document.querySelector('[style*="width: 400px"]');
            const realPanelHeight = panelElement?.offsetHeight || 112;

            // Espacement fixe qui correspond à la taille du panneau
            const bulbSpacing = 18;
            const horizontalCount = Math.round((panelWidth - 2 * margin) / bulbSpacing) + 1;
            const verticalCount = 6; // Nombre fixe correspondant à la hauteur calculée (16 + 5*18 = 106px)

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
                  x = margin + (col * (panelWidth - 2 * margin)) / Math.max(1, horizontalCount - 1);
                }

                // Position Y : première et dernière rangée aux bords exacts
                if (row === 0) {
                  y = margin;
                } else if (row === verticalCount - 1) {
                  y = realPanelHeight - margin;
                } else {
                  y =
                    margin +
                    (row * (realPanelHeight - 2 * margin)) / Math.max(1, verticalCount - 1);
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

        {/* Titre */}
        <h2
          className="text-lg md:text-xl lg:text-2xl font-bold text-white text-center font-press-start-2p leading-tight relative flex items-center justify-center w-full h-full"
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
