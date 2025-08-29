import { ensureDBIntegrity } from '../utils/dbIntegrity';

async function main() {
  console.log('🚀 Starting database initialization...');

  try {
    const result = await ensureDBIntegrity();

    if (result) {
      console.log('✅ Database initialization completed successfully!');
      process.exit(0);
    } else {
      console.error('❌ Database initialization failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Fatal error during database initialization:', error);
    process.exit(1);
  }
}

main();
