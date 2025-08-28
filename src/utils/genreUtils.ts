import { MUSIC_GENRES, getMusicGenreDisplay } from '@/data/musicGenres';

/**
 * Parse preferred genres from database (JSON string) or frontend (array)
 * @param genresData - Can be JSON string, array, or null
 * @returns Array of genre IDs
 */
export function parsePreferredGenres(genresData: string | string[] | null | undefined): string[] {
  if (!genresData) return [];
  if (Array.isArray(genresData)) return genresData;

  try {
    const parsed = JSON.parse(genresData);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error parsing preferred genres:', error);
    return [];
  }
}

/**
 * Format preferred genres for display
 * @param genresData - Can be JSON string, array, or null
 * @param locale - Language locale ('fr' or 'en')
 * @param separator - Separator for joining genre names (default: ', ')
 * @returns Formatted string of genre names
 */
export function formatPreferredGenres(
  genresData: string | string[] | null | undefined,
  locale: 'fr' | 'en' = 'fr',
  separator: string = ', ',
): string {
  const genreIds = parsePreferredGenres(genresData);

  if (genreIds.length === 0) {
    return locale === 'fr' ? 'Aucun genre sélectionné' : 'No genres selected';
  }

  const genreNames = genreIds.map((genreId) => {
    // Find the genre in MUSIC_GENRES
    const genre = MUSIC_GENRES.find((g) => g.id === genreId);
    if (genre) {
      return getMusicGenreDisplay(genreId, locale);
    }

    // Fallback for legacy data or unknown genres
    return genreId;
  });

  return genreNames.join(separator);
}

/**
 * Validate that all genre IDs exist in MUSIC_GENRES
 * @param genreIds - Array of genre IDs to validate
 * @returns Object with valid genres and invalid ones
 */
export function validateGenreIds(genreIds: string[]): {
  valid: string[];
  invalid: string[];
} {
  const validGenreIds = MUSIC_GENRES.map((g) => g.id);
  const valid: string[] = [];
  const invalid: string[] = [];

  genreIds.forEach((genreId) => {
    if (validGenreIds.includes(genreId)) {
      valid.push(genreId);
    } else {
      invalid.push(genreId);
    }
  });

  return { valid, invalid };
}

/**
 * Migrate legacy genre names/IDs to current MUSIC_GENRES format
 * @param legacyGenres - Array of old genre names or IDs
 * @returns Array of current genre IDs
 */
export function migrateLegacyGenres(legacyGenres: string[]): string[] {
  const legacyMappings: Record<string, string> = {
    // Legacy name -> current ID
    electro: 'electronic',
    'hip-hop': 'hiphop',
    métal: 'metal',
    classique: 'classical',
    alternatif: 'alternative',
    indé: 'indie',
    // Add more mappings as needed
  };

  return legacyGenres.map((legacyGenre) => {
    const normalized = legacyGenre.toLowerCase();

    // Check if it's already a valid genre ID
    if (MUSIC_GENRES.find((g) => g.id === normalized)) {
      return normalized;
    }

    // Check legacy mappings
    if (legacyMappings[normalized]) {
      return legacyMappings[normalized];
    }

    // Try to find by French or English name
    const genreByName = MUSIC_GENRES.find(
      (g) => g.nameFr.toLowerCase() === normalized || g.nameEn.toLowerCase() === normalized,
    );

    if (genreByName) {
      return genreByName.id;
    }

    // Return as-is if no mapping found (will be flagged as invalid by validateGenreIds)
    return legacyGenre;
  });
}
