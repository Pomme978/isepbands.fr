export interface MusicGenre {
  id: string;
  nameFr: string;
  nameEn: string;
}

export const MUSIC_GENRES: MusicGenre[] = [
  { id: 'rock', nameFr: 'Rock', nameEn: 'Rock' },
  { id: 'pop', nameFr: 'Pop', nameEn: 'Pop' },
  { id: 'jazz', nameFr: 'Jazz', nameEn: 'Jazz' },
  { id: 'classical', nameFr: 'Classique', nameEn: 'Classical' },
  { id: 'blues', nameFr: 'Blues', nameEn: 'Blues' },
  { id: 'folk', nameFr: 'Folk', nameEn: 'Folk' },
  { id: 'electronic', nameFr: 'Électronique', nameEn: 'Electronic' },
  { id: 'hiphop', nameFr: 'Hip-Hop', nameEn: 'Hip-Hop' },
  { id: 'rnb', nameFr: 'R&B', nameEn: 'R&B' },
  { id: 'country', nameFr: 'Country', nameEn: 'Country' },
  { id: 'metal', nameFr: 'Metal', nameEn: 'Metal' },
  { id: 'punk', nameFr: 'Punk', nameEn: 'Punk' },
  { id: 'reggae', nameFr: 'Reggae', nameEn: 'Reggae' },
  { id: 'world', nameFr: 'World', nameEn: 'World' },
  { id: 'alternative', nameFr: 'Alternatif', nameEn: 'Alternative' },
  { id: 'indie', nameFr: 'Indé', nameEn: 'Indie' },
  { id: 'funk', nameFr: 'Funk', nameEn: 'Funk' },
  { id: 'soul', nameFr: 'Soul', nameEn: 'Soul' },
  { id: 'disco', nameFr: 'Disco', nameEn: 'Disco' },
  { id: 'house', nameFr: 'House', nameEn: 'House' }
];

export function getMusicGenreDisplay(genreId: string, locale: 'fr' | 'en'): string {
  const genre = MUSIC_GENRES.find(g => g.id === genreId);
  if (!genre) return genreId;
  return locale === 'fr' ? genre.nameFr : genre.nameEn;
}

export function getMusicGenreIds(): string[] {
  return MUSIC_GENRES.map(g => g.id);
}