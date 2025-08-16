import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultInstruments = [
  'Guitare électrique',
  'Guitare acoustique',
  'Basse électrique',
  'Batterie',
  'Piano',
  'Clavier/Synthétiseur',
  'Violon',
  'Saxophone',
  'Trompette',
  'Flûte',
  'Harmonica',
  'Ukulélé',
  'Accordéon',
  'Violoncelle',
  'Trombone',
  'Clarinette',
  'Djembé',
  'Cajon',
  'Chant',
  'Beatbox',
];

async function seedInstruments() {
  console.log('🎵 Seeding instruments...');

  for (const instrumentName of defaultInstruments) {
    await prisma.instrument.upsert({
      where: { name: instrumentName },
      update: {},
      create: {
        name: instrumentName,
        imageUrl: null,
      },
    });
  }

  console.log(`✅ Successfully seeded ${defaultInstruments.length} instruments!`);
}

async function main() {
  try {
    await seedInstruments();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
