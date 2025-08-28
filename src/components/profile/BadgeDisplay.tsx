// @components/settings/BadgeDisplay.tsx
'use client';

import { Star } from 'lucide-react';

type Pronouns = 'he/him' | 'she/her' | 'they/them' | 'other';

interface BadgeDisplayProps {
  role: string;
  badges: string[];
  isLookingForGroup: boolean;
  pronouns: Pronouns;
  className?: string;
  bgColor?: string;
  textSize?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

// Role display name is now handled by the API based on user pronouns

export default function BadgeDisplay({
  role,
  badges,
  isLookingForGroup,
  pronouns,
  className = "",
  bgColor = "bg-gradient-to-r from-secondary to-primary",
  textSize = "text-sm",
  size = "md",
}: BadgeDisplayProps) {
  
  // Size configurations
  const sizeConfig = {
    xs: {
      padding: "px-2 py-1",
      text: "text-xs",
      icon: "h-2 w-2",
      gap: "gap-1"
    },
    sm: {
      padding: "px-3 py-1.5",
      text: "text-xs",
      icon: "h-3 w-3",
      gap: "gap-1.5"
    },
    md: {
      padding: "px-4 py-2",
      text: "text-sm",
      icon: "h-4 w-4",
      gap: "gap-2"
    },
    lg: {
      padding: "px-5 py-3",
      text: "text-base",
      icon: "h-4 w-4",
      gap: "gap-3"
    }
  };

  const config = sizeConfig[size];
  const finalTextSize = textSize !== "text-sm" ? textSize : config.text;
  return (
    <div className={`flex ${config.gap} flex-wrap items-center ${className}`}>
      {/* Badge de rôle principal */}
      <span className={`inline-flex items-center ${config.padding} ${bgColor} text-white rounded-full ${finalTextSize} font-medium shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 ease-in-out`}>
        {role}
      </span>

      {/* Badges supplémentaires */}
      {badges && badges.length > 0 && badges.map((badge, index) => (
        <span
          key={index}
          className={`inline-flex items-center ${config.padding} bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300 rounded-full ${finalTextSize} font-medium shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 ease-in-out`}
        >
          {badge}
        </span>
      ))}

      {/* Badge "Recherche un groupe" */}
      {isLookingForGroup && (
        <span className={`inline-flex items-center ${config.padding} bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full ${finalTextSize} font-medium shadow-sm hover:shadow-md animate-pulse hover:scale-105 transition-all duration-200 ease-in-out`}>
          <Star className={`${config.icon} mr-1`} />
          Prêt à rejoindre un groupe
        </span>
      )}
    </div>
  );
}
