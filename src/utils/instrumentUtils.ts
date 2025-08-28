/**
 * Utility functions for instrument display names
 */

interface Instrument {
  id?: number;
  name?: string;
  nameFr?: string;
  nameEn?: string;
}

/**
 * Get the display name for an instrument based on language
 */
export function getInstrumentDisplayName(
  instrument: Instrument | null | undefined,
  lang: 'fr' | 'en' = 'fr',
): string {
  if (!instrument) return 'Unknown Instrument';

  if (lang === 'fr') {
    return instrument.nameFr || instrument.name || 'Instrument inconnu';
  } else {
    return instrument.nameEn || instrument.name || 'Unknown Instrument';
  }
}

/**
 * Get instrument names for a list of instruments
 */
export function getInstrumentNames(instruments: Instrument[], lang: 'fr' | 'en' = 'fr'): string[] {
  return instruments.map((inst) => getInstrumentDisplayName(inst, lang));
}
