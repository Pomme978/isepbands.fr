import Image from 'next/image';
import { StaticImageData } from 'next/image';
import { useMemo } from 'react';

interface NeonLogoProps {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  neon?: boolean;
  color?: `#${string}`; // Hex color type
  seed?: string; // Optional seed for consistent animations
  intensity?: number; // 0.1 to 2.0, controls glow strength
  flickerFrequency?: 'low' | 'medium' | 'high'; // Controls how often it flickers
}

const NeonLogo: React.FC<NeonLogoProps> = ({
  src,
  alt,
  width = 300,
  height = 300,
  className = '',
  neon = false,
  color = '#ffffff',
  seed,
  intensity = 1.0,
  flickerFrequency = 'high',
}) => {
  // Detect if the image is PNG by checking the src
  const isPNG = useMemo(() => {
    if (typeof src === 'string') {
      return src.toLowerCase().includes('.png');
    }
    if (typeof src === 'object' && src.src) {
      return src.src.toLowerCase().includes('.png');
    }
    return false;
  }, [src]);

  const baseFilter = isPNG ? `` : `brightness(0) saturate(100%) invert(1)`;

  const getNeonFilter = (hexColor: string, glowIntensity: number = 1.0): string => {
    // Convert hex to RGB for drop-shadow
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // For PNG images, only apply backdrop-filter style glow effects
    if (isPNG) {
      return `drop-shadow(0 0 ${2 * glowIntensity}px rgba(${r}, ${g}, ${b}, 1)) 
              drop-shadow(0 0 ${8 * glowIntensity}px rgba(${r}, ${g}, ${b}, 0.8)) 
              drop-shadow(0 0 ${16 * glowIntensity}px rgba(${r}, ${g}, ${b}, 0.6)) 
              drop-shadow(0 0 ${32 * glowIntensity}px rgba(${r}, ${g}, ${b}, 0.4))
              drop-shadow(0 0 ${64 * glowIntensity}px rgba(${r}, ${g}, ${b}, 0.2))`;
    }

    // Enhanced multi-layer glow for more realistic neon effect (SVG)
    return `${baseFilter} 
            drop-shadow(0 0 ${2 * glowIntensity}px rgba(${r}, ${g}, ${b}, 1)) 
            drop-shadow(0 0 ${8 * glowIntensity}px rgba(${r}, ${g}, ${b}, 0.8)) 
            drop-shadow(0 0 ${16 * glowIntensity}px rgba(${r}, ${g}, ${b}, 0.6)) 
            drop-shadow(0 0 ${32 * glowIntensity}px rgba(${r}, ${g}, ${b}, 0.4))
            drop-shadow(0 0 ${64 * glowIntensity}px rgba(${r}, ${g}, ${b}, 0.2))`;
  };

  const getColorFilter = (hexColor: string): string => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // For PNG images, only apply subtle glow without color inversion
    if (isPNG) {
      return `drop-shadow(0 0 3px rgba(${r}, ${g}, ${b}, 0.5))`;
    }

    return `${baseFilter} drop-shadow(0 0 3px rgba(${r}, ${g}, ${b}, 0.5))`;
  };

  // Create stable values using useMemo to prevent hydration mismatch
  const stableValues = useMemo(() => {
    const createSeededRandom = (seedStr: string) => {
      let hash = 0;
      for (let i = 0; i < seedStr.length; i++) {
        const char = seedStr.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }

      return () => {
        hash = (hash * 9301 + 49297) % 233280;
        return hash / 233280;
      };
    };

    const finalSeed = seed || `${alt}-${color}-neon`;
    const random = createSeededRandom(finalSeed);

    const uniqueId = `neon-${finalSeed.replace(/[^a-zA-Z0-9]/g, '').substr(0, 9)}`;

    // Frequency-based animation duration
    const baseDuration = {
      low: 45, // 45-60 seconds
      medium: 25, // 25-35 seconds
      high: 15, // 15-25 seconds
    }[flickerFrequency];

    const animationDuration = random() * 10 + baseDuration;

    return { uniqueId, animationDuration, random };
  }, [seed, alt, color, flickerFrequency]);

  const logoFilter = neon ? getNeonFilter(color, intensity) : getColorFilter(color);
  const logoClassName = neon ? `${className} ${stableValues.uniqueId}` : className;

  // Convert hex to RGB for animations
  const getRGBFromHex = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    return (
      cleanHex
        .match(/.{2}/g)
        ?.map((x) => parseInt(x, 16))
        .join(', ') || '255, 255, 255'
    );
  };

  const rgbColor = getRGBFromHex(color);

  // Helper function to generate filters for keyframes
  const generateKeyframeFilter = (intensityMultiplier: number = 1) => {
    if (isPNG) {
      return `drop-shadow(0 0 ${2 * intensity * intensityMultiplier}px rgba(${rgbColor}, ${1 * intensityMultiplier}))
              drop-shadow(0 0 ${8 * intensity * intensityMultiplier}px rgba(${rgbColor}, ${0.8 * intensityMultiplier}))
              drop-shadow(0 0 ${16 * intensity * intensityMultiplier}px rgba(${rgbColor}, ${0.6 * intensityMultiplier}))
              drop-shadow(0 0 ${32 * intensity * intensityMultiplier}px rgba(${rgbColor}, ${0.4 * intensityMultiplier}))
              drop-shadow(0 0 ${64 * intensity * intensityMultiplier}px rgba(${rgbColor}, ${0.2 * intensityMultiplier}))`;
    } else {
      return `brightness(0) saturate(100%) invert(1)
              drop-shadow(0 0 ${2 * intensity * intensityMultiplier}px rgba(${rgbColor}, ${1 * intensityMultiplier}))
              drop-shadow(0 0 ${8 * intensity * intensityMultiplier}px rgba(${rgbColor}, ${0.8 * intensityMultiplier}))
              drop-shadow(0 0 ${16 * intensity * intensityMultiplier}px rgba(${rgbColor}, ${0.6 * intensityMultiplier}))
              drop-shadow(0 0 ${32 * intensity * intensityMultiplier}px rgba(${rgbColor}, ${0.4 * intensityMultiplier}))
              drop-shadow(0 0 ${64 * intensity * intensityMultiplier}px rgba(${rgbColor}, ${0.2 * intensityMultiplier}))`;
    }
  };

  const generateFlickerOffFilter = () => {
    if (isPNG) {
      // Pour PNG, on diminue juste l'intensité du glow au lieu de l'éteindre complètement
      return `drop-shadow(0 0 ${2 * intensity * 0.1}px rgba(${rgbColor}, ${1 * 0.1}))
              drop-shadow(0 0 ${8 * intensity * 0.1}px rgba(${rgbColor}, ${0.8 * 0.1}))`;
    } else {
      return `brightness(0) saturate(100%) invert(1) 
              drop-shadow(0 0 ${2 * intensity * 0.1}px rgba(${rgbColor}, ${1 * 0.1}))
              drop-shadow(0 0 ${8 * intensity * 0.1}px rgba(${rgbColor}, ${0.8 * 0.1}))`;
    }
  };

  // Generate more realistic flicker patterns
  const generateFlickerKeyframes = () => {
    const { random } = stableValues;
    let keyframes = '';
    let currentTime = 0;

    // Initial stable period (8-15% of animation)
    const startDelay = random() * 7 + 8;
    currentTime = startDelay;

    // Number of flicker events based on frequency
    const eventCounts = {
      low: [2, 4], // 2-3 events
      medium: [3, 6], // 3-5 events
      high: [5, 9], // 5-8 events
    };

    const [minEvents, maxEvents] = eventCounts[flickerFrequency];
    const numEvents = Math.floor(random() * (maxEvents - minEvents)) + minEvents;

    for (let i = 0; i < numEvents; i++) {
      // Varied delays between events
      if (i > 0) {
        const delayRange = {
          low: [15, 25], // 15-25% gaps
          medium: [8, 18], // 8-18% gaps
          high: [3, 12], // 3-12% gaps
        }[flickerFrequency];

        const delay = random() * (delayRange[1] - delayRange[0]) + delayRange[0];
        currentTime += delay;
      }

      if (currentTime >= 92) break;

      // Create flicker sequence
      const flickerIntensity = random() * 0.4 + 0.7; // 0.7-1.1 intensity
      const shouldHavePreFlicker = random() < 0.3; // 30% chance of pre-flicker
      const flickerType = random();

      if (flickerType < 0.6) {
        // Quick single flicker (60% chance)
        const flickerDuration = random() * 0.15 + 0.05; // 0.05-0.2%

        if (shouldHavePreFlicker) {
          // Slight dim before flicker
          keyframes += `
                        ${(currentTime - 0.02).toFixed(3)}% {
                            filter: ${generateKeyframeFilter(0.7)};
                        }`;
        }

        keyframes += `
                    ${currentTime.toFixed(3)}% {
                        filter: ${generateFlickerOffFilter()};
                    }
                    ${(currentTime + flickerDuration).toFixed(3)}% {
                        filter: ${generateKeyframeFilter(flickerIntensity)};
                    }`;

        currentTime += flickerDuration;
      } else if (flickerType < 0.85) {
        // Double flicker (25% chance)
        const flicker1Duration = random() * 0.08 + 0.03;
        const gap = random() * 0.1 + 0.05;
        const flicker2Duration = random() * 0.12 + 0.04;

        // First flicker
        keyframes += `
                    ${currentTime.toFixed(3)}% {
                        filter: ${generateFlickerOffFilter()};
                    }
                    ${(currentTime + flicker1Duration).toFixed(3)}% {
                        filter: ${generateKeyframeFilter(flickerIntensity)};
                    }`;

        currentTime += flicker1Duration + gap;

        // Second flicker
        keyframes += `
                    ${currentTime.toFixed(3)}% {
                        filter: ${generateFlickerOffFilter()};
                    }
                    ${(currentTime + flicker2Duration).toFixed(3)}% {
                        filter: ${generateKeyframeFilter(flickerIntensity)};
                    }`;

        currentTime += flicker2Duration;
      } else {
        // Sustained dim with recovery (15% chance)
        const dimDuration = random() * 0.8 + 0.3; // 0.3-1.1%
        const dimIntensity = random() * 0.3 + 0.1; // Very dim but not completely off

        keyframes += `
                    ${currentTime.toFixed(3)}% {
                        filter: ${generateKeyframeFilter(dimIntensity)};
                    }
                    ${(currentTime + dimDuration).toFixed(3)}% {
                        filter: ${generateKeyframeFilter(1)};
                    }`;

        currentTime += dimDuration;
      }

      // Optional pause after flicker (20% chance)
      if (random() < 0.2 && currentTime < 85) {
        currentTime += random() * 3 + 2; // 2-5% pause
      }
    }

    return keyframes;
  };

  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={logoClassName}
        style={{
          filter: logoFilter,
          backgroundColor: 'transparent',
          mixBlendMode: 'normal',
        }}
        priority={true}
        quality={100}
      />

      {neon && (
        <style jsx global>{`
          @keyframes neon-flicker-${stableValues.uniqueId} {
            0%,
            100% {
              filter: ${generateKeyframeFilter(1)};
            }
            ${generateFlickerKeyframes()}
          }

          .${stableValues.uniqueId} {
            animation: neon-flicker-${stableValues.uniqueId} ${stableValues.animationDuration}s
              infinite;
            animation-delay: ${stableValues.animationDuration * 0.1}s;
            transition: filter 0.05s ease-in-out;
          }
        `}</style>
      )}
    </>
  );
};

export default NeonLogo;
