'use client';

import BasicLayout from '@/components/layouts/BasicLayout';
import HeroBanner from '@/components/home/HomeHero';
import heroImage from '@/assets/images/hero/asso-hero-min.jpg';

export default function Asso() {
  return (
    <BasicLayout>
      <div>
        <div className="h-200"> </div>
      </div>
    </BasicLayout>
  );
}

/**
 *
 *         <HeroBanner
 *           title="L'Association"
 *           backgroundImage={heroImage}
 *           useGradient={false}
 *           gradientDirection="bg-gradient-to-br"
 *           gradientFrom="from-orange-400"
 *           gradientVia="via-red-500"
 *           gradientTo="to-purple-600"
 *         />
 */
