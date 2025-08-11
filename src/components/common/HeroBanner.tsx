import Image from 'next/image';
import { StaticImageData } from 'next/image';

const HeroBanner = ({
  title = '',
  subtitle = '',
  backgroundImage = '/hero-bg.jpg',
  useGradient = false,
  gradientFrom = 'from-blue-600',
  gradientVia = 'via-purple-600',
  gradientTo = 'to-indigo-800',
  gradientDirection = 'bg-gradient-to-br',
  customGradient = '',
}: {
  title?: string;
  subtitle?: string;
  backgroundImage?: string | StaticImageData;
  useGradient?: boolean;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  gradientDirection?: string;
  customGradient?: string;
}) => {
  return (
    <div className="relative w-full overflow-hidden h-[50vh] ">
      {/* Background Image */}
      {backgroundImage && !useGradient && (
        <Image src={backgroundImage} alt="Hero background" fill className="object-cover" priority />
      )}

      {/* Gradient Background (alternative to image) */}
      {useGradient && (
        <div
          className={
            customGradient
              ? 'absolute inset-0'
              : `absolute inset-0 ${gradientDirection} ${gradientFrom} ${gradientVia} ${gradientTo}`
          }
          style={customGradient ? { background: customGradient } : {}}
        />
      )}

      {/* White overlay for blending with website */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-start h-full text-left text-white px-6 max-w-7xl! mx-auto">
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light opacity-90 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default HeroBanner;
