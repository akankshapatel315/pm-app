import { DataTypes as SequelizeDataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) => {
  class Project extends Model {
    declare id: number;
    declare name: string;
    declare clientName: string;
    declare monthlyHourCap: number | null;
    declare createdBy: number;
    declare managerId: number | null;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    static associate(models: any) {
      Project.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
      Project.belongsTo(models.User, { foreignKey: 'managerId', as: 'manager' });
      Project.hasMany(models.ProjectMember, { foreignKey: 'projectId', as: 'projectMembers' });
      Project.belongsToMany(models.User, {
        through: models.ProjectMember,
        foreignKey: 'projectId',
        otherKey: 'userId',
        as: 'members',
      });
      Project.hasMany(models.Entry, { foreignKey: 'projectId', as: 'entries' });
    }
  }

  Project.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clientName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'client_name',
      },
      monthlyHourCap: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'monthly_hour_cap',
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'created_by',
      },
      managerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'manager_id',
      },
    },
    {
      sequelize,
      modelName: 'Project',
      tableName: 'projects',
      underscored: true,
    }
  );

  return Project;
};
