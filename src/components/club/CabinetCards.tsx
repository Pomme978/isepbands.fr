'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  const handleMoreInfoClick = () => {
    // TODO: Navigate to events page section when available
    // For now, just scroll to top or show alert
    console.log("Plus d'info clicked - will navigate to events section");
    // router.push('/events#activities'); // Uncomment when events page is ready
  };

  // Generate random rotations on mount only once - never 0 rotation
  useEffect(() => {
    if (cardRotations.length === 0) {
      const rotations = cards.map(() => {
        let rotation = (Math.random() - 0.5) * 16; // -8 to +8 degrees (doubled for more visible rotation)
        if (Math.abs(rotation) < 2) {
          rotation = rotation >= 0 ? 3 : -3; // Minimum 3 degrees for more visible effect
        }
        return rotation;
      });
      setCardRotations(rotations);
    }
  }, [cards.length]); // Only depend on cards length, not cards content

  // Check if we're on mobile from window width
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate hash-based rotations and offsets for stack cards to create messy effect
  const getStackTransforms = (cardTitle: string, cardContent: string, stackCount: number) => {
    const stackTransforms = [];

    // Create a simple hash from card content to ensure deterministic results
    const hash = (cardTitle + cardContent).split('').reduce((acc, char) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) & 0xffffffff;
    }, 0);

    for (let i = 0; i < stackCount - 1; i++) {
      // Use hash + index to generate consistent pseudo-random values
      const seed = Math.abs(hash + i * 1234);

      // Generate rotation (-8 to +8 degrees for more visible effect)
      let rotation = (seed % 1600) / 100 - 8; // -8 to +8 (increased range)
      if (Math.abs(rotation) < 2.5) {
        rotation = rotation >= 0 ? 3.5 : -3.5; // Higher minimum rotation for messy effect
      }

      // Generate small offsets for messier stacking
      const offsetX = ((seed % 100) / 50 - 1) * 3; // -3px to +3px
      const offsetY = (((seed * 7) % 100) / 50 - 1) * 2; // -2px to +2px

      stackTransforms.push({
        rotation,
        offsetX,
        offsetY,
      });
    }
    return stackTransforms;
  };

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

  // Generate hash-based random position for single cards
  const getSingleCardPosition = (cardTitle: string, cardContent: string) => {
    // Create a simple hash from card content to ensure deterministic positioning
    const hash = (cardTitle + cardContent).split('').reduce((acc, char) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) & 0xffffffff;
    }, 0);

    // Generate position between 10% and 90% of container height
    const position = 10 + (Math.abs(hash) % 80); // 10-90%
    return position;
  };

  if (cardRotations.length === 0) return null;

  return (
    <div
      className={`flex flex-col gap-6 h-full justify-center ${isMobile ? 'items-center' : 'items-end'} pr-2 overflow-visible`}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          className="relative flex-shrink-0"
          style={{
            transform: `rotate(${cardRotations[index]}deg)`,
          }}
        >
          {/* Stack cards if specified - lighter cards behind with messy rotations */}
          {card.stack &&
            card.stack > 1 &&
            (() => {
              const stackTransforms = getStackTransforms(card.title, card.content, card.stack);
              return Array.from({ length: card.stack - 1 }).map((_, stackIndex) => {
                // Calculate lighter gray for each stack level
                const grayColor = `rgb(${209 - stackIndex * 20}, ${213 - stackIndex * 20}, ${219 - stackIndex * 20})`;
                const transform = stackTransforms[stackIndex];

                return (
                  <div
                    key={`stack-${stackIndex}`}
                    className="absolute inset-0 rounded-lg border border-gray-300"
                    style={{
                      backgroundColor: grayColor,
                      transform: `translate(${(stackIndex + 1) * 2 + transform.offsetX}px, ${(stackIndex + 1) * 2 + transform.offsetY}px) rotate(${transform.rotation}deg)`,
                      zIndex: -(stackIndex + 1),
                    }}
                  />
                );
              });
            })()}

          {/* Main Card - Larger Vertical Rectangle */}
          <div className="bg-white rounded-lg shadow-lg p-4 w-48 h-60 md:w-40 md:h-52 border border-gray-400 relative z-10 transition-transform duration-300 hover:scale-105 cursor-pointer">
            {/* Top section: Title and Content */}
            <div className="flex flex-col justify-between h-full">
              <div className="flex-1 min-h-0">
                <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2">{card.title}</h3>
                <p className="text-xs text-gray-600 leading-tight line-clamp-4">{card.content}</p>
              </div>

              {/* Bottom section: Link and Logo */}
              <div className="flex justify-between items-center mt-2 pt-2">
                <button
                  onClick={handleMoreInfoClick}
                  className="text-xs text-gray-800 hover:text-primary underline underline-offset-1 cursor-pointer transition-colors"
                >
                  Plus d&apos;info &gt;
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
