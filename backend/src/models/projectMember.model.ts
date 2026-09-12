import { DataTypes as SequelizeDataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) => {
  class ProjectMember extends Model {
    declare id: number;
    declare userId: number;
    declare projectId: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    static associate(models: any) {
      ProjectMember.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      ProjectMember.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
    }
  }

  ProjectMember.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'project_id',
      },
    },
    {
      sequelize,
      modelName: 'ProjectMember',
      tableName: 'project_members',
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'project_id'],
        },
      ],
    }
  );

  return ProjectMember;
};
