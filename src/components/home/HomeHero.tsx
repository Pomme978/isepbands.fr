'use client';

import { Button } from '@/components/ui/button';
import NeonLogo from '@/components/common/NeonLogo'; // Adjust path as needed
import isepbands_logo from '@/assets/images/logo_bands.png';
//import isepbands_logo from '@/assets/svg/logo_isepbands_new.svg';
import { ChevronDown } from 'lucide-react';
import StageLights from '@/components/home/StageLights';
import Crowd from '@/components/home/Crowd';
import MusicNotes from '@/components/home/MusicNotes';
import LangLink from '@/components/common/LangLink';
import SocialsLink from '@/components/common/SocialsLink';
import { useSession } from '@/lib/auth-client';
import { useParams } from 'next/navigation';
import { useI18n } from '@/locales/client';

const HomeHero = () => {
  const { user, loading } = useSession();
  const params = useParams();
  const lang = typeof params?.lang === 'string' ? params.lang : 'fr';
  const t = useI18n();

  // When user is logged in, navbar is fixed and adds pt-16, so we need to compensate
  // When loading, navbar is static and adds spacer, so we need to compensate too
  // Use loading state to prevent layout shift during initial load
  const marginClass = user && !loading ? '-mt-16' : loading ? '-mt-20 md:-mt-16' : '';

  return (
    <div className={`relative w-full min-h-screen overflow-hidden ${marginClass}`}>
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

      {/* Content Container - Mobile responsive */}
      <div className="relative z-40 flex flex-col md:flex-row items-center justify-center min-h-screen text-white px-4 sm:px-6 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-center items-center w-full gap-4 md:gap-8 text-center lg:text-left overflow-visible">
          {/* Logo Section - Better mobile positioning */}
          <div className="flex justify-center flex-shrink-0 p-2 md:p-4 overflow-visible">
            <NeonLogo
              src={isepbands_logo}
              alt="ISEP Bands Logo"
              width={300}
              height={300}
              className="w-52 h-52 md:w-80 md:h-80 logo-transparent"
              neon={true}
              intensity={0.3}
            />
          </div>

          {/* Content Section - Compact mobile spacing */}
          <div className="text-center lg:text-left max-w-xl md:max-w-5/12 px-2 md:px-0">
            {/* Motto - Responsive text sizing */}
            <h1 className="text-2xl sm:text-4xl md:text-4xl lg:text-5xl text-center md:text-left font-bold mb-6 md:mb-8 leading-tight">
              {t('page.home.hero.motto')}
            </h1>

            {/* Button - Compact mobile layout */}
            <div className="flex flex-col sm:flex-row justify-between w-full items-center gap-3 sm:gap-0">
              {!user && !loading && (
                <Button
                  asChild
                  size="lg"
                  className="relative shadow-md overflow-hidden bg-primary text-sm sm:text-md py-3 sm:py-6 px-6 sm:px-12 text-primary-foreground w-full sm:w-auto"
                >
                  <LangLink href={`/club#rejoindre-asso`}>{t('page.home.hero.joinUs')}</LangLink>
                </Button>
              )}
              <SocialsLink
                iconColor="text-white"
                iconHoverColor="text-gray-200"
                iconSize="w-6 h-6 sm:w-8 sm:h-8"
              />
            </div>
          </div>
        </div>

        {/* Scroll hint - Inside hero background with better mobile positioning */}
        <button
          onClick={() => window.scrollBy({ top: window.innerHeight * 0.5, behavior: 'smooth' })}
          className="absolute left-1/2 bottom-8 md:bottom-4 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer bg-transparent border-none"
        >
          {user && !loading && (
            <span className="text-xs text-white/70 animate-bounce-subtle font-light">
              {t('page.home.hero.scrollHint')}
            </span>
          )}
          <ChevronDown className="inline-block h-6 w-6 sm:h-8 sm:w-8 text-white animate-bounce-subtle drop-shadow-[0_0_10px_rgba(208,97,252,0.35)]" />
        </button>
      </div>

      {/* Custom CSS for animations with reduced movement */}
      <style jsx>{`
        /* Logo transparency fix for mobile */
        :global(.logo-transparent) {
          background: transparent !important;
          background-color: transparent !important;
          box-shadow: none;
        }
        :global(.logo-transparent img) {
          background: transparent !important;
          background-color: transparent !important;
          mix-blend-mode: normal;
        }

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
