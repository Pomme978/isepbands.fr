'use client';

import { Button } from '@/components/ui/button';
import NeonLogo from '@/components/common/NeonLogo'; // Adjust path as needed
import isepbands_logo from '@/assets/images/isepbands-logo.svg';
import { ChevronDown } from 'lucide-react';
import StageLights from '@/components/home/StageLights';
import Crowd from '@/components/home/Crowd';
import MusicNotes from '@/components/home/MusicNotes';
import LangLink from '@/components/common/LangLink';
import SocialsLink from '@/components/common/SocialsLink';
import { useSession } from '@/lib/auth-client';
import { useParams } from 'next/navigation';


const HomeHero = () => {
  const { user } = useSession();
  const params = useParams();
  const lang = typeof params?.lang === 'string' ? params.lang : 'fr';

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* Custom Background Color */}
      <div className="absolute inset-0 z-0 w-full" style={{ backgroundColor: '#2E135F' }} />
      <MusicNotes />
      <StageLights />
      <Crowd />

      {/* Animated Circles - Now contained within viewport
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute rounded-full animate-float-1"
          style={{
            width: '500px',
            height: '500px',
            backgroundColor: '#D061FC',
            filter: 'blur(250px)',
            opacity: 0.5,
            left: '-250px', // Reduced from -100px
            top: '-250px', // Reduced from -100px
          }}
        />
        <div
          className="absolute rounded-full animate-float-2"
          style={{
            width: '400px',
            height: '400px',
            backgroundColor: '#D061FC',
            filter: 'blur(200px)',
            opacity: 0.5,
            right: '-200px', // Reduced from -50px
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
        <div
          className="absolute rounded-full animate-float-3"
          style={{
            width: '600px',
            height: '600px',
            backgroundColor: '#D061FC',
            filter: 'blur(300px)',
            opacity: 0.4,
            left: '50%',
            bottom: '-300px', // Reduced from -200px
            transform: 'translateX(-50%)',
          }}
        />
      </div>*/}

      {/* Content Container - Allow glow to show */}
      <div className="relative z-40 flex items-center justify-center h-full text-white px-6 overflow-hidden">
        <div className="flex justify-center items-center w-full max-w-6xl mx-auto gap-8 text-center lg:text-left overflow-visible">
          {/* Logo Section - Allow glow overflow */}
          <div className="flex justify-center flex-shrink-0 p-4 overflow-visible">
            <NeonLogo
              src={isepbands_logo}
              alt="ISEP Bands Logo"
              width={300}
              height={300}
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-80 md:h-80"
              neon={true}
              intensity={0.3}
            />
          </div>

          {/* Content Section */}
          <div className="text-center lg:text-left max-w-6/12">
            {/* Motto */}
            <h1 className=" text-2xl sm:text-4xl md:text-5xl text-justify  font-bold mb-8">
              FOR THOSE WHO CAN’T STOP PLAYING
            </h1>

            {/* Button */}
            <div className="flex justify-between w-full items-center">
              {!user && (
                <Button
                  asChild
                  size="lg"
                  className="relative shadow-md overflow-hidden bg-primary text-md py-6 px-12 text-primary-foreground"
                >
                  <LangLink href={`/register`}>Join Us</LangLink>
                </Button>
              )}
              <SocialsLink
                iconColor="text-white"
                iconHoverColor="text-gray-200"
                iconSize="w-8 h-8"
              />
            </div>
          </div>
          {/* Scroll hint */}
          <a href="#next" className="absolute left-1/2 bottom-4 -translate-x-1/2 z-20">
            <ChevronDown className="inline-block h-8 w-8 text-white animate-bounce-subtle drop-shadow-[0_0_10px_rgba(208,97,252,0.35)]" />
          </a>
        </div>
      </div>

      {/* Custom CSS for animations with reduced movement */}
      <style jsx>{`
        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(4px);
          }
        }
        :global(.animate-bounce-subtle) {
          animation: bounce-subtle 2.5s ease-in-out infinite;
        }
        @keyframes float-1 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-15px) rotate(90deg) scale(1.05);
          }
          50% {
            transform: translateY(-8px) rotate(180deg) scale(0.95);
          }
          75% {
            transform: translateY(-20px) rotate(270deg) scale(1.02);
          }
        }

        @keyframes float-2 {
          0%,
          100% {
            transform: translateY(-50%) translateX(0px) rotate(0deg) scale(1);
          }
          33% {
            transform: translateY(-50%) translateX(10px) rotate(120deg) scale(0.98);
          }
          66% {
            transform: translateY(-50%) translateX(-8px) rotate(240deg) scale(1.04);
          }
        }

        @keyframes float-3 {
          0%,
          100% {
            transform: translateX(-50%) translateY(0px) rotate(0deg) scale(1);
          }
          40% {
            transform: translateX(-50%) translateY(-18px) rotate(144deg) scale(1.08);
          }
          80% {
            transform: translateX(-50%) translateY(8px) rotate(288deg) scale(0.92);
          }
        }

        .animate-float-1 {
          animation: float-1 12s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 15s ease-in-out infinite;
        }

        .animate-float-3 {
          animation: float-3 18s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HomeHero;
