'use client';

import { useState, useEffect } from 'react';

interface CardData {
  title: string;
  content: string;
  stack?: number;
}

interface CabinetCardsProps {
  cards: CardData[];
}

export default function CabinetCards({ cards }: CabinetCardsProps) {
  const [cardRotations, setCardRotations] = useState<number[]>([]);

  // Generate random rotations on mount only once - never 0 rotation
  useEffect(() => {
    if (cardRotations.length === 0) {
      const rotations = cards.map(() => {
        let rotation = (Math.random() - 0.5) * 8; // -4 to +4 degrees
        if (Math.abs(rotation) < 1) {
          rotation = rotation >= 0 ? 1.5 : -1.5; // Minimum 1.5 degrees
        }
        return rotation;
      });
      setCardRotations(rotations);
    }
  }, [cards.length]); // Only depend on cards length, not cards content

  // Get the logo SVG (from site)
  const LogoSVG = () => (
    <svg
      width="16" 
      height="16" 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-800"
    >
      <rect 
        width="32" 
        height="32" 
        x="4" 
        y="4" 
        fill="currentColor" 
        rx="6" 
        transform="rotate(12 20 20)"
      />
    </svg>
  );

  if (cardRotations.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 h-full justify-center items-end pr-4 overflow-hidden">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className="relative flex-shrink-0"
          style={{
            transform: `rotate(${cardRotations[index]}deg)`,
          }}
        >
          {/* Stack cards if specified */}
          {card.stack && card.stack > 1 && (
            Array.from({ length: card.stack - 1 }).map((_, stackIndex) => (
              <div
                key={`stack-${stackIndex}`}
                className="absolute inset-0 bg-gray-700 rounded-lg shadow-md"
                style={{
                  transform: `translate(${(stackIndex + 1) * 2}px, ${(stackIndex + 1) * 2}px)`,
                  zIndex: -(stackIndex + 1),
                }}
              />
            ))
          )}
          
          {/* Main Card - Larger Vertical Rectangle */}
          <div className="bg-white rounded-lg shadow-lg p-4 w-40 h-52 border border-gray-400 relative z-10">
            {/* Top section: Title and Content */}
            <div className="flex flex-col justify-between h-full">
              <div className="flex-1 min-h-0">
                <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-600 leading-tight line-clamp-4">
                  {card.content}
                </p>
              </div>
              
              {/* Bottom section: Link and Logo */}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                <button className="text-xs text-gray-800 hover:text-gray-900 underline underline-offset-1">
                  Plus d'info &gt;
                </button>
                <LogoSVG />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}