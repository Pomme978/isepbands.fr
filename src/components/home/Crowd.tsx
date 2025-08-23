import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CrowdSvg from '@/assets/svg/crowd.svg';

interface CrowdProps {
  className?: string;
  crowdHeight?: number;
}

const Crowd: React.FC<CrowdProps> = ({ className = '', crowdHeight = 200 }) => {
  const [screenWidth, setScreenWidth] = useState(1920); // Default width for SSR
  const [mounted, setMounted] = useState(false);

  const crowdWidth = 600;

  useEffect(() => {
    setMounted(true);
    setScreenWidth(window.innerWidth);

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const crowdCount = Math.ceil(screenWidth / crowdWidth) + 1;

  return (
    <div
      className={`absolute bottom-0 left-0 w-screen opacity-40 overflow-hidden blur-xs z-10 ${className}`}
      style={{
        height: `${crowdHeight}px`,
        visibility: mounted ? 'visible' : 'hidden', // Prevent flash during hydration
      }}
    >
      {Array.from({ length: crowdCount }).map((_, index) => (
        <div
          key={index}
          className="absolute bottom-0"
          style={{
            left: `${index * crowdWidth}px`,
            width: `${crowdWidth}px`,
            height: `${crowdHeight}px`,
          }}
        >
          <Image
            src={CrowdSvg}
            alt="Crowd"
            width={crowdWidth}
            height={crowdHeight}
            className="object-contain object-bottom"
            priority={index < 3} // Prioritize first 3 images
          />
        </div>
      ))}
    </div>
  );
};

export default Crowd;
