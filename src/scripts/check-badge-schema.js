import { prisma } from '../lib/prisma.js';

async function checkBadgeSchema() {
  try {
    // Try to get a badge record to see what fields exist
    const badge = await prisma.$queryRaw`DESCRIBE Badge`;
    console.log('Badge table structure:', badge);
  } catch (error) {
    console.error('Error checking badge schema:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBadgeSchema();
