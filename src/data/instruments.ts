export interface DefaultInstrument {
  name: string;
  nameFr: string;
  nameEn: string;
  imageUrl?: string;
}

export const defaultInstruments: DefaultInstrument[] = [
  { name: 'electric_guitar', nameFr: 'Guitare électrique', nameEn: 'Electric Guitar' },
  { name: 'acoustic_guitar', nameFr: 'Guitare acoustique', nameEn: 'Acoustic Guitar' },
  { name: 'electric_bass', nameFr: 'Basse électrique', nameEn: 'Electric Bass' },
  { name: 'drums', nameFr: 'Batterie', nameEn: 'Drums' },
  { name: 'piano', nameFr: 'Piano', nameEn: 'Piano' },
  { name: 'keyboard', nameFr: 'Clavier/Synthétiseur', nameEn: 'Keyboard/Synthesizer' },
  { name: 'violin', nameFr: 'Violon', nameEn: 'Violin' },
  { name: 'saxophone', nameFr: 'Saxophone', nameEn: 'Saxophone' },
  { name: 'trumpet', nameFr: 'Trompette', nameEn: 'Trumpet' },
  { name: 'flute', nameFr: 'Flûte', nameEn: 'Flute' },
  { name: 'harmonica', nameFr: 'Harmonica', nameEn: 'Harmonica' },
  { name: 'ukulele', nameFr: 'Ukulélé', nameEn: 'Ukulele' },
  { name: 'accordion', nameFr: 'Accordéon', nameEn: 'Accordion' },
  { name: 'cello', nameFr: 'Violoncelle', nameEn: 'Cello' },
  { name: 'trombone', nameFr: 'Trombone', nameEn: 'Trombone' },
  { name: 'clarinet', nameFr: 'Clarinette', nameEn: 'Clarinet' },
  { name: 'djembe', nameFr: 'Djembé', nameEn: 'Djembe' },
  { name: 'cajon', nameFr: 'Cajon', nameEn: 'Cajon' },
  { name: 'vocals', nameFr: 'Chant', nameEn: 'Vocals' },
  { name: 'beatbox', nameFr: 'Beatbox', nameEn: 'Beatbox' },
];
