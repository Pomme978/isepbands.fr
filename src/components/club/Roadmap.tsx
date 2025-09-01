// components/Roadmap.tsx
'use client';
import React from 'react';
import ArrowBar from './ArrowBar';

type Item = { title: string; subtitle?: string };

interface RoadmapProps {
  items: Item[];
  title?: string;
  className?: string;
  colorClass?: string; // couleur de l'arrow (ex "text-slate-900")
}

export default function Roadmap({
  items,
  title = 'NOTRE VISION',
  className = '',
  colorClass = 'text-slate-800',
}: RoadmapProps) {
  // Base h-12 (48px) then +16px per item
  const BASE_DASH_PX = 48; // = Tailwind h-12
  const STEP_DASH_PX = 46; // increment per column/item

  return (
    <section className={`w-full ${className}`}>
      {/* Desktop / Tablet */}
      <div className="hidden md:block">
        <ArrowBar title={title} orientation="horizontal" className={colorClass} />

        {/* colonne par item */}
        <div
          className="-mt-8 grid gap-6"
          style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
        >
          {items.map((it, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* trait pointillé depuis la flèche (12 -> more and more) */}
              <div
                className="border-l-2 border-dashed border-slate-300"
                style={{ height: BASE_DASH_PX + i * STEP_DASH_PX }}
              />
              {/* carte carrée */}
              <div className="w-full max-w-[220px] aspect-square rounded-xl bg-slate-800 text-white p-4 text-center shadow-lg flex flex-col items-center justify-center">
                <div className="text-sm font-semibold">{it.title}</div>
                {it.subtitle && (
                  <div className="mt-1 text-md max-w-20 opacity-80 leading-snug">{it.subtitle}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden mx-4">
        {/* Titre NOTRE VISION affiché en haut sur mobile */}
        <h2 className="text-2xl font-bold text-center mb-15 tracking-wider">{title}</h2>
        
        <div className="flex flex-row items-start gap-4">
          {/* ArrowBar à gauche - augmentée */}
          <div className="flex-shrink-0">
            <ArrowBar 
              showTitle={false} 
              orientation="vertical" 
              className={colorClass}
              mobileHeightClass="h-[28rem]"
              height={120}
            />
          </div>
          
          {/* Cartes en colonne à droite - rectangulaires et ajustées à la hauteur de la flèche */}
          <div className="flex flex-col justify-between flex-1 h-[28rem] gap-2">
            {items.map((it, i) => (
              <div key={i} className="flex-1">
                <div className="w-full h-full rounded-xl bg-slate-800 text-white p-3 text-center shadow-lg flex flex-col items-center justify-center">
                  <div className="text-sm font-semibold">{it.title}</div>
                  {it.subtitle && (
                    <div className="mt-1 text-xs opacity-80 leading-snug">{it.subtitle}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
