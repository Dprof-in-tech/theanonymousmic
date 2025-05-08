import { initializeDatabase } from '../lib/db';

async function setup() {
  try {
    console.log('Setting up database...');
    await initializeDatabase();
    console.log('Database setup completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setup();