'use client';

import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import {
  siFacebook,
  siInstagram,
  siYoutube,
  siX,
  siTiktok,
  siDiscord,
  siSpotify,
  siTwitch,
  siGithub,
} from 'simple-icons';

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  sortOrder: number;
}

interface SocialsLinkProps {
  className?: string;
  iconColor?: string;
  iconHoverColor?: string;
  iconSize?: string;
  gap?: string;
}

const platformIcons: Record<string, string> = {
  facebook: siFacebook.path,
  instagram: siInstagram.path,
  youtube: siYoutube.path,
  twitter: siX.path,
  x: siX.path,
  tiktok: siTiktok.path,
  discord: siDiscord.path,
  spotify: siSpotify.path,
  twitch: siTwitch.path,
  github: siGithub.path,
};

const platformNames: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  twitter: 'Twitter',
  x: 'X (Twitter)',
  tiktok: 'TikTok',
  discord: 'Discord',
  spotify: 'Spotify',
  twitch: 'Twitch',
  github: 'GitHub',
};

// Plateformes supportées avec icônes
export const supportedPlatforms = [
  'facebook',
  'instagram',
  'youtube',
  'twitter',
  'x',
  'tiktok',
  'discord',
  'spotify',
  'twitch',
  'github',
];

export default function SocialsLink({
  className = '',
  iconColor = 'text-gray-600',
  iconHoverColor = 'text-gray-900',
  iconSize = 'w-5 h-5',
  gap = 'gap-4',
}: SocialsLinkProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await fetch('/api/social-links');
        if (response.ok) {
          const data = await response.json();
          setSocialLinks(data);
        }
      } catch (error) {
        console.error('Error fetching social links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  if (loading || socialLinks.length === 0) {
    return null;
  }

  return (
    <div className={`flex ${gap} ${className}`}>
      {socialLinks.map((social) => {
        const iconPath = platformIcons[social.platform.toLowerCase()];
        const platformName = platformNames[social.platform.toLowerCase()] || social.platform;

        if (!iconPath) {
          console.warn(`No icon found for platform: ${social.platform}`);
          return null;
        }

        return (
          <a
            key={social.id}
            href={social.url}
            className={`
              ${iconColor} 
              hover:${iconHoverColor} 
              transition-colors p-1
            `}
            aria-label={platformName}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className={iconSize} fill="currentColor" viewBox="0 0 24 24">
              <path d={iconPath} />
            </svg>
          </a>
        );
      })}
    </div>
  );
}
