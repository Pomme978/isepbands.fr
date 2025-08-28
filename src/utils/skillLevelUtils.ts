/**
 * Utility functions for skill level translations
 */

const SKILL_LEVEL_TRANSLATIONS: Record<string, { fr: string; en: string }> = {
  BEGINNER: { fr: 'Débutant', en: 'Beginner' },
  INTERMEDIATE: { fr: 'Intermédiaire', en: 'Intermediate' },
  ADVANCED: { fr: 'Avancé', en: 'Advanced' },
  EXPERT: { fr: 'Expert', en: 'Expert' },
  // Also handle lowercase versions
  beginner: { fr: 'Débutant', en: 'Beginner' },
  intermediate: { fr: 'Intermédiaire', en: 'Intermediate' },
  advanced: { fr: 'Avancé', en: 'Advanced' },
  expert: { fr: 'Expert', en: 'Expert' },
};

export function getSkillLevelDisplayName(level: string, lang: 'fr' | 'en' = 'fr'): string {
  const translation =
    SKILL_LEVEL_TRANSLATIONS[level] || SKILL_LEVEL_TRANSLATIONS[level.toUpperCase()];

  if (!translation) {
    // If no translation found, return the original level with proper casing
    return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
  }

  return translation[lang];
}

// Export a function to get French skill level specifically
export function getSkillLevelFr(level: string): string {
  return getSkillLevelDisplayName(level, 'fr');
}

// Export a function to get English skill level specifically
export function getSkillLevelEn(level: string): string {
  return getSkillLevelDisplayName(level, 'en');
}
