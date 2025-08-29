'use client';

import { ReactNode, useState, useEffect } from 'react';

interface GridBackgroundProps {
  children?: ReactNode;
  lineSpacing?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function GridBackground({
  children,
  lineSpacing = 80,
  className = '',
  style,
}: GridBackgroundProps) {
  const [actualLineSpacing, setActualLineSpacing] = useState(lineSpacing);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateSpacing = () => {
      const isMobile = window.innerWidth < 768;
      const mobileWidth = window.innerWidth;
      const spacing = isMobile ? Math.round(mobileWidth / 4) : lineSpacing;
      setActualLineSpacing(spacing);
    };

    updateSpacing();
    window.addEventListener('resize', updateSpacing);
    return () => window.removeEventListener('resize', updateSpacing);
  }, [lineSpacing]);

  // Calculer le nombre de lignes nécessaires pour bien couvrir l'écran + débordement
  const numberOfLines = Math.ceil(2400 / actualLineSpacing); // Plus large pour couvrir tous les écrans
  const centerIndex = Math.floor(numberOfLines / 2);

  return (
    <div
      className={`w-full bg-gradient-to-b from-[#0C0E12] to-zinc-800 relative ${className}`}
      style={style}
    >
      {/* Lignes en arrière-plan (absolute pour ne pas affecter la hauteur) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Ligne horizontale en haut */}
        <div className="absolute top-0 left-0 w-full h-px" style={{ backgroundColor: '#2E2E2E' }} />

        {/* Lignes verticales - positionnées depuis le centre */}
        <div className="absolute inset-0">
          {Array.from({ length: numberOfLines }, (_, i) => (
            <div
              key={i}
              className="absolute h-full w-px"
              style={{
                backgroundColor: '#2E2E2E',
                left: `calc(50% + ${(i - centerIndex) * actualLineSpacing}px)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Contenu qui détermine la hauteur */}
      <div className="relative w-full" style={{ zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
}
