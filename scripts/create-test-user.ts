import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function createTestUser() {
  console.log('👤 Creating test user...');
  
  const testEmail = 'test@isep.fr';
  const testPassword = 'TestPassword123!';
  
  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email: testEmail }
  });
  
  if (existingUser) {
    console.log('⚠️ Test user already exists!');
    console.log(`📧 Email: ${testEmail}`);
    console.log(`🔑 Password: ${testPassword}`);
    return;
  }
  
  // Hasher le mot de passe
  const hashedPassword = await hashPassword(testPassword);
  
  // Créer l'utilisateur
  const user = await prisma.user.create({
    data: {
      firstName: 'Test',
      lastName: 'User',
      email: testEmail,
      password: hashedPassword,
      promotion: 'A3',
      birthDate: new Date('2000-01-01'),
      phone: '+33123456789',
      biography: 'Utilisateur de test créé automatiquement',
      emailVerified: true,
      status: 'ACTIVE',
      isLookingForGroup: false,
    }
  });
  
  // Créer une demande d'inscription acceptée
  await prisma.registrationRequest.create({
    data: {
      userId: user.id,
      status: 'ACCEPTED',
      motivation: 'Utilisateur de test',
      experience: 'Test experience'
    }
  });
  
  // Ajouter quelques instruments
  const instruments = await prisma.instrument.findMany({ take: 3 });
  if (instruments.length > 0) {
    for (let i = 0; i < Math.min(2, instruments.length); i++) {
      await prisma.userInstrument.create({
        data: {
          userId: user.id,
          instrumentId: instruments[i].id,
          skillLevel: i === 0 ? 'INTERMEDIATE' : 'BEGINNER'
        }
      });
    }
  }
  
  console.log('✅ Test user created successfully!');
  console.log(`📧 Email: ${testEmail}`);
  console.log(`🔑 Password: ${testPassword}`);
  console.log(`🆔 User ID: ${user.id}`);
}

async function main() {
  try {
    await createTestUser();
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
