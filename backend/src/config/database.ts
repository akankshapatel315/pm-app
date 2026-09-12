import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

export const sequelize = new Sequelize(
  DB_NAME as string,
  DB_USER as string,
  DB_PASSWORD,
  {
    host: DB_HOST || 'localhost',
    port: Number(DB_PORT) || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

export default sequelize;
