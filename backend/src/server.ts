import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import db from './models';
import { ensureDatabaseExists } from './utils/ensureDatabase';

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await ensureDatabaseExists();
    await db.sequelize.authenticate();
    console.log('Database connection established.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

start();
