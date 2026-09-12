import { DataTypes as SequelizeDataTypes, Model, Sequelize } from 'sequelize';

export const ROLES = ['admin', 'pm', 'member'] as const;
export type UserRole = (typeof ROLES)[number];

export default (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) => {
  class User extends Model {
    declare id: number;
    declare name: string;
    declare email: string;
    declare password: string;
    declare role: UserRole;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    static associate(models: any) {
      User.hasMany(models.Project, { foreignKey: 'created_by', as: 'createdProjects' });
      User.hasMany(models.Project, { foreignKey: 'manager_id', as: 'managedProjects' });
      User.hasMany(models.ProjectMember, { foreignKey: 'user_id', as: 'projectMemberships' });
      User.belongsToMany(models.Project, {
        through: models.ProjectMember,
        foreignKey: 'user_id',
        otherKey: 'project_id',
        as: 'projects',
      });
      User.hasMany(models.Entry, { foreignKey: 'user_id', as: 'entries' });
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(...ROLES),
        allowNull: false,
        defaultValue: 'member',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
    }
  );

  return User;
};
