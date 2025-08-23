// src/components/team/GroupPhoto.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Scotch from '@/components/common/Scotch';

interface GroupPhotoProps {
  src: string | { default: string } | { src: string };
  alt?: string;
  className?: string;
  showScotch?: boolean;
  scotchCount?: number;
}

const GroupPhoto: React.FC<GroupPhotoProps> = ({
  src,
  alt = 'Photo de groupe du bureau',
  className = '',
  showScotch = true,
  scotchCount = 2,
}) => {
  return (
    <div className={`flex justify-center mb-1 px-4 ${className}`}>
      <div className="relative w-full max-w-4xl">
        {/* Photo container */}
        <div className="relative max-w-4xl w-full bg-white/5 rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          <Image
            src={src}
            alt={alt}
            width={1024} // Set a max width
            height={0} // Auto height
            className="w-full h-auto md:h-124 object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
          />

          {/* Photo frame effect */}
          <div className="absolute inset-0 rounded-2xl border-4 border-white/20 pointer-events-none" />
        </div>

        {/* Scotch tapes */}
        {showScotch && (
          <>
            {Array.from({ length: scotchCount }, (_, index) => {
              const positions = [
                { left: '25%', top: '-15px', rotation: -5 },
                { left: '75%', top: '-12px', rotation: 8 },
                { left: '50%', top: '-18px', rotation: -3 },
              ];

              const position = positions[index] || positions[0];

              return (
                <Scotch
                  key={index}
                  className="absolute z-10"
                  opacity={0.8}
                  width={120}
                  rotation={position.rotation}
                  style={{
                    left: position.left,
                    top: position.top,
                    transform: `translateX(-50%) rotate(${position.rotation}deg)`,
                  }}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default GroupPhoto;
