import dotenv from 'dotenv';
dotenv.config();

import { ensureDatabaseExists } from '../utils/ensureDatabase';

ensureDatabaseExists()
  .then(() => {
    console.log('Database check complete.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to ensure database exists:', error);
    process.exit(1);
  });
