import { Venue } from '@/types/venue';

// Mock venues data - sera remplacé par les appels DB
export const MOCK_VENUES: Venue[] = [
  {
    id: '1',
    name: 'NDC - Salle de musique',
    description: 'Salle de musique principale du campus NDC',
    venueType: 'CAMPUS',
    address: '28 Rue Notre Dame des Champs',
    city: 'Paris',
    postalCode: '75006',
    country: 'France',
    photoUrl: '/images/ndc-music-room.jpg',
    metroLine: 'Ligne 12 - Notre-Dame-des-Champs',
    accessInstructions: "Accès par l'entrée principale, 2ème étage",
    status: 'ACTIVE',
    createdAt: new Date('2024-01-15').toISOString(),
    eventsCount: 15,
  },
  {
    id: '2',
    name: 'NDL - Salle de répétition',
    description: 'Salle de répétition équipée du campus NDL',
    venueType: 'CAMPUS',
    address: '10 Rue de Vanves',
    city: 'Issy-les-Moulineaux',
    postalCode: '92130',
    country: 'France',
    photoUrl: '/images/ndl-rehearsal-room.jpg',
    metroLine: 'Ligne 12 - Corentin Celton',
    accessInstructions: "Accès par l'entrée étudiants, sous-sol",
    status: 'ACTIVE',
    createdAt: new Date('2024-02-01').toISOString(),
    eventsCount: 8,
  },
  {
    id: '3',
    name: 'Salle de concert Neuilly',
    description: 'Grande salle de concert pour événements publics',
    venueType: 'CONCERT_HALL',
    address: '15 Avenue Charles de Gaulle',
    city: 'Neuilly-sur-Seine',
    postalCode: '92200',
    country: 'France',
    photoUrl: '/images/neuilly-concert-hall.jpg',
    metroLine: 'Ligne 1 - Pont de Neuilly',
    accessInstructions: "Entrée artistes par l'arrière du bâtiment",
    status: 'ACTIVE',
    createdAt: new Date('2024-01-20').toISOString(),
    eventsCount: 5,
  },
  {
    id: '4',
    name: 'Studio Problématique',
    description: "Ancien studio avec problèmes d'acoustique",
    venueType: 'RECORDING_STUDIO',
    address: '25 Rue de la République',
    city: 'Boulogne-Billancourt',
    postalCode: '92100',
    country: 'France',
    staffNotes: "À ÉVITER - Problèmes d'isolation phonique et équipement défaillant",
    status: 'AVOID',
    createdAt: new Date('2023-12-10').toISOString(),
    eventsCount: 2,
  },
  {
    id: '5',
    name: 'Le Jazz Corner',
    description: 'Bar jazz avec scène ouverte',
    venueType: 'BAR',
    address: '42 Rue des Martyrs',
    city: 'Paris',
    postalCode: '75009',
    country: 'France',
    metroLine: 'Ligne 12 - Pigalle',
    accessInstructions: "Accès par l'entrée principale, scène au fond",
    status: 'ACTIVE',
    createdAt: new Date('2024-03-01').toISOString(),
    eventsCount: 12,
  },
  {
    id: '6',
    name: 'Restaurant Le Mélodieux',
    description: 'Restaurant avec soirées musicales',
    venueType: 'RESTAURANT',
    address: '8 Place Saint-Germain',
    city: 'Paris',
    postalCode: '75006',
    country: 'France',
    metroLine: 'Ligne 4 - Saint-Germain-des-Prés',
    accessInstructions: "Demander l'accès à l'espace concert à l'accueil",
    status: 'ACTIVE',
    createdAt: new Date('2024-02-15').toISOString(),
    eventsCount: 8,
  },
  {
    id: '7',
    name: 'Club Nocturne Problématique',
    description: 'Boîte de nuit avec voisinage difficile',
    venueType: 'NIGHTCLUB',
    address: '156 Boulevard de Clichy',
    city: 'Paris',
    postalCode: '75018',
    country: 'France',
    metroLine: 'Ligne 2 - Pigalle',
    staffNotes: 'À ÉVITER - Conflits récurrents avec le voisinage et fermetures fréquentes',
    status: 'AVOID',
    createdAt: new Date('2023-11-20').toISOString(),
    eventsCount: 1,
  },
];

// Service functions
export const venueService = {
  // Récupérer tous les venues
  async getAllVenues(): Promise<Venue[]> {
    // Simuler un appel API
    await new Promise((resolve) => setTimeout(resolve, 100));
    return MOCK_VENUES;
  },

  // Récupérer un venue par ID
  async getVenueById(id: string): Promise<Venue | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return MOCK_VENUES.find((venue) => venue.id === id) || null;
  },

  // Créer un nouveau venue
  async createVenue(venueData: Omit<Venue, 'id' | 'createdAt' | 'eventsCount'>): Promise<Venue> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newVenue: Venue = {
      ...venueData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      eventsCount: 0,
    };

    // Dans un vrai projet, cela serait sauvé en DB
    MOCK_VENUES.push(newVenue);

    return newVenue;
  },

  // Mettre à jour un venue
  async updateVenue(id: string, updates: Partial<Venue>): Promise<Venue | null> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const venueIndex = MOCK_VENUES.findIndex((venue) => venue.id === id);
    if (venueIndex === -1) return null;

    const updatedVenue = { ...MOCK_VENUES[venueIndex], ...updates };
    MOCK_VENUES[venueIndex] = updatedVenue;

    return updatedVenue;
  },

  // Supprimer un venue
  async deleteVenue(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const venueIndex = MOCK_VENUES.findIndex((venue) => venue.id === id);
    if (venueIndex === -1) return false;

    MOCK_VENUES.splice(venueIndex, 1);
    return true;
  },
};
