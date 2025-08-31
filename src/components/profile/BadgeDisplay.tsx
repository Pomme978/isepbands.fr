// @components/settings/BadgeDisplay.tsx
'use client';

import { Star } from 'lucide-react';

type Pronouns = 'he/him' | 'she/her' | 'they/them' | 'other';

interface Badge {
  id: number;
  name: string;
  description?: string | null;
  color: string;
  isSystemBadge: boolean;
  assignedAt?: string | Date | null;
  badgeDefinition?: {
    id: number;
    key: string;
    labelFr: string;
    labelEn: string;
    color: string;
    colorEnd?: string | null;
    gradientDirection: string;
    textColor: string;
    description?: string | null;
  };
}

interface BadgeDisplayProps {
  role: string;
  badges: Badge[] | string[];
  isLookingForGroup: boolean;
  pronouns: Pronouns;
  className?: string;
  bgColor?: string;
  textSize?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

// Role display name is now handled by the API based on user pronouns

// Utility function to determine if a color is dark
const isColorDark = (color: string): boolean => {
  // Remove # if present
  const hex = color.replace('#', '');

  // Parse RGB values
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance < 0.5;
};

export default function BadgeDisplay({
  role,
  badges,
  isLookingForGroup,
  pronouns,
  className = '',
  bgColor = 'bg-gradient-to-r from-secondary to-primary',
  textSize = 'text-sm',
  size = 'md',
}: BadgeDisplayProps) {
  // Size configurations
  const sizeConfig = {
    xs: {
      padding: 'px-2 py-1',
      text: 'text-xs',
      icon: 'h-2 w-2',
      gap: 'gap-1',
    },
    sm: {
      padding: 'px-3 py-1.5',
      text: 'text-xs',
      icon: 'h-3 w-3',
      gap: 'gap-1.5',
    },
    md: {
      padding: 'px-4 py-2',
      text: 'text-sm',
      icon: 'h-4 w-4',
      gap: 'gap-2',
    },
    lg: {
      padding: 'px-5 py-3',
      text: 'text-base',
      icon: 'h-4 w-4',
      gap: 'gap-3',
    },
  };

  const config = sizeConfig[size] || sizeConfig.md; // Fallback to 'md' if size is invalid
  const finalTextSize = textSize !== 'text-sm' ? textSize : config.text;
  return (
    <div className={`flex ${config.gap} flex-wrap items-center ${className}`}>
      {/* Badge de rôle principal */}
      <span
        className={`inline-flex items-center ${config.padding} ${bgColor} text-white rounded-full ${finalTextSize} font-bold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 ease-in-out`}
      >
        {role}
      </span>

      {/* Badges supplémentaires */}
      {badges &&
        badges.length > 0 &&
        badges.map((badge, index) => {
          // Handle both new Badge objects and legacy string arrays
          if (typeof badge === 'string') {
            return (
              <span
                key={index}
                className={`inline-flex items-center ${config.padding} bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300 rounded-full ${finalTextSize} font-bold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 ease-in-out`}
              >
                {badge}
              </span>
            );
          } else {
            // Badge object with color information
            // Use color from badgeDefinition if available, otherwise fallback to badge.color or default
            const badgeColor = badge.badgeDefinition?.color || badge.color || '#FF6B35';
            const badgeColorEnd = badge.badgeDefinition?.colorEnd;
            const gradientDirection = badge.badgeDefinition?.gradientDirection || 'to right';
            // Use textColor from badgeDefinition if available, otherwise calculate optimal
            const textColor = badge.badgeDefinition?.textColor || (isColorDark(badgeColor) ? 'white' : 'black');
            // Use labelFr from badgeDefinition if available, otherwise use badge.name
            const displayName = badge.badgeDefinition?.labelFr || badge.name;
            const description = badge.badgeDefinition?.description || badge.description;


            // Determine background style (gradient or solid)
            const backgroundStyle = badgeColorEnd 
              ? { background: `linear-gradient(${gradientDirection}, ${badgeColor}, ${badgeColorEnd})` }
              : { backgroundColor: badgeColor };

            return (
              <span
                key={badge.id || index}
                className={`inline-flex items-center ${config.padding} rounded-full ${finalTextSize} font-bold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 ease-in-out [color:var(--badge-text-color)!important]`}
                style={{
                  ...backgroundStyle,
                  color: textColor,
                  '--badge-text-color': textColor,
                } as React.CSSProperties & { '--badge-text-color': string }}
                title={description || undefined}
              >
                {displayName}
              </span>
            );
          }
        })}

      {/* Badge "Recherche un groupe" */}
      {isLookingForGroup && (
        <span
          className={`inline-flex items-center ${config.padding} bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full ${finalTextSize} font-medium shadow-sm hover:shadow-md animate-pulse hover:scale-105 transition-all duration-200 ease-in-out`}
        >
          <Star className={`${config.icon} mr-1`} />
          Prêt à rejoindre un groupe
        </span>
      )}
    </div>
  );
}
