/**
 * Utility functions for badge display names
 */

const BADGE_LABELS: Record<string, { fr: string; en: string }> = {
  'founding_member': { 
    fr: 'Membre Fondateur', 
    en: 'Founding Member' 
  },
  'former_board_2024': { 
    fr: 'Ancien Bureau 2024-25', 
    en: 'Former Board 2024-25' 
  },
  'concert_performer': { 
    fr: 'Artiste de Concert', 
    en: 'Concert Performer' 
  },
  'jam_regular': { 
    fr: 'Habitué des Jams', 
    en: 'Jam Session Regular' 
  },
  'studio_artist': { 
    fr: 'Artiste Studio', 
    en: 'Studio Recording Artist' 
  },
  'event_organizer': { 
    fr: 'Organisateur d\'Événements', 
    en: 'Event Organizer' 
  }
};

/**
 * Get the display name for a badge based on language
 */
export function getBadgeDisplayName(
  badgeId: string,
  lang: 'fr' | 'en' = 'fr'
): string {
  const label = BADGE_LABELS[badgeId];
  if (label) {
    return label[lang];
  }
  
  // If not found in mapping, try to make it readable
  // Convert snake_case to Title Case
  return badgeId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get badge names for a list of badge IDs
 */
export function getBadgeNames(
  badgeIds: string[],
  lang: 'fr' | 'en' = 'fr'
): string[] {
  return badgeIds.map(id => getBadgeDisplayName(id, lang));
}