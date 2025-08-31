'use client';

type Variant = 'lines' | 'circle';

interface BgElementsProps {
  variant: Variant; // "lines" ou "circle"
  className?: string; // classes wrapper
  sizeClassName?: string; // taille globale du canvas
  lineCount?: number; // nombre de barres (par défaut 3)
  lineLength?: string; // longueur des barres (ex: "100%")
  lineThickness?: string; // épaisseur (ex: "12%" ou "20px")
  lineGap?: string; // espacement vertical/horizontal entre barres (ex: "20px" ou "15%")
  lineAngle?: number; // angle en degrés (ex: -35 pour diagonale)
  circleGap?: string; // espacement entre les cercles (pour variant circle)
}

export default function BgElements({
  variant,
  className = '',
  sizeClassName = 'w-32 h-32',
  lineCount = 3,
  lineLength = '100%',
  lineThickness = '12%',
  lineGap = '18%',
  lineAngle = -35,
  circleGap = '20%',
}: BgElementsProps) {
  if (variant === 'circle') {
    const borderWidth = lineThickness.includes('px') ? lineThickness : '20px';
    const gapValue = circleGap.includes('%') ? circleGap : '25%';

    return (
      <div className={`${sizeClassName} ${className} text-slate-800 blur-[2px]`} aria-hidden>
        {/* Cercle extérieur */}
        <div
          className="absolute inset-0 rounded-full border-current"
          style={{ borderWidth, borderStyle: 'solid' }}
        />
        {/* Cercle intérieur */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-current"
          style={{
            width: `calc(100% - 2 * ${gapValue})`,
            height: `calc(100% - 2 * ${gapValue})`,
            borderWidth,
            borderStyle: 'solid',
          }}
        />
      </div>
    );
  }

  // variant === "lines"
  return (
    <div
      className={`${sizeClassName} ${className} text-slate-800 blur-[2px]`}
      style={{ transform: `rotate(${lineAngle}deg)` }}
      aria-hidden
    >
      {Array.from({ length: lineCount }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-current rounded-sm z-0"
          style={{
            width: lineLength,
            height: lineThickness,
            top: `calc(${i} * ${lineGap})`,
            left: '',
          }}
        />
      ))}
    </div>
  );
}
