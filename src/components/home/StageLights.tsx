import React from 'react';
import Image from 'next/image';
import LightLeft from '@/assets/svg/light_left.svg';
import LightCenter from '@/assets/svg/light_center.svg';
import LightRight from '@/assets/svg/light_right.svg';

interface StageLightsProps {
  className?: string;
}

const StageLights: React.FC<StageLightsProps> = ({ className = '' }) => {
  return (
    <div className={`absolute top-0 left-0 w-screen h-screen z-30 opacity-60 ${className}`}>
      {/* Left Light - Positioned further out in top-left corner */}
      <div className="absolute -top-20 -left-20">
        <div
          className="origin-top-left"
          style={{
            animation: 'gentle-rotate-left 8s ease-in-out infinite alternate',
          }}
        >
          <Image src={LightLeft} alt="Left stage light" className="object-contain" />
        </div>
      </div>

      {/* Center Light - No rotation, stays steady */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        <Image src={LightCenter} alt="Center stage light" className="object-contain" />
      </div>

      {/* Right Light - Positioned further out in top-right corner */}
      <div className="absolute -top-20 -right-20">
        <div
          className="origin-top-right"
          style={{
            animation: 'gentle-rotate-right 7s ease-in-out infinite alternate',
          }}
        >
          <Image src={LightRight} alt="Right stage light" className="object-contain" />
        </div>
      </div>

      <style jsx>{`
        @keyframes gentle-rotate-left {
          0% {
            transform: rotate(-8deg);
          }
          100% {
            transform: rotate(8deg);
          }
        }

        @keyframes gentle-rotate-right {
          0% {
            transform: rotate(8deg);
          }
          100% {
            transform: rotate(-8deg);
          }
        }
      `}</style>
    </div>
  );
};

export default StageLights;
