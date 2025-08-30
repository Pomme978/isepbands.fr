import { prisma } from '../lib/prisma.ts';

async function addAssignedAtField() {
  try {
    console.log('Adding assignedAt field to Badge table...');

    // Add the assignedAt column with default current timestamp
    await prisma.$executeRaw`
      ALTER TABLE Badge 
      ADD COLUMN assignedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    `;

    console.log('✅ Successfully added assignedAt field to Badge table');

    // Verify the change
    const badgeCount = await prisma.badge.count();
    console.log(`✅ Badge table now has ${badgeCount} records with assignedAt field`);
  } catch (error) {
    if (error.message.includes('Duplicate column name')) {
      console.log('⚠️  Column assignedAt already exists in Badge table');
    } else {
      console.error('❌ Error adding assignedAt field:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

addAssignedAtField();
