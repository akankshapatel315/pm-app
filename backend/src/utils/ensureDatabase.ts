import { Client } from 'pg';

export async function ensureDatabaseExists(): Promise<void> {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

  const client = new Client({
    host: DB_HOST || 'localhost',
    port: Number(DB_PORT) || 5432,
    user: DB_USER,
    password: DB_PASSWORD,
    database: 'postgres',
  });

  await client.connect();

  try {
    const result = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [DB_NAME]);

    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`Database "${DB_NAME}" did not exist, created it.`);
    }
  } finally {
    await client.end();
  }
}
