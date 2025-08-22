// components/board/Clothespin.tsx
import React from 'react';
import Image from 'next/image';
import clothespinSvg from '@/assets/svg/Clothespin.svg';

interface ClothespinProps {
  className?: string;
}

export const Clothespin: React.FC<ClothespinProps> = ({ className = '' }) => {
  return (
    <div className={`w-12 h-16 ${className}`}>
      <Image
        src={clothespinSvg}
        alt="Clothespin"
        width={48}
        height={64}
        className="w-full h-full object-contain"
      />
    </div>
  );
};
