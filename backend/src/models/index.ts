import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database';

const db: Record<string, any> = {};
const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file !== basename &&
      (file.endsWith('.ts') || file.endsWith('.js')) &&
      !file.endsWith('.d.ts')
    );
  })
  .forEach((file) => {
    const modelModule = require(path.join(__dirname, file));
    const define = modelModule.default || modelModule;
    const model = define(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
