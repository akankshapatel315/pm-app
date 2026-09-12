import { DataTypes as SequelizeDataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) => {
  class Entry extends Model {
    declare id: number;
    declare notes: string | null;
    declare userId: number;
    declare projectId: number;
    declare date: string;
    declare hours: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    static associate(models: any) {
      Entry.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      Entry.belongsTo(models.Project, { foreignKey: 'project_id', as: 'project' });
    }
  }

  Entry.init(
    {
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
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
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      hours: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Entry',
      tableName: 'entries',
      underscored: true,
    }
  );

  return Entry;
};
