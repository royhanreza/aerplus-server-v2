// 'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WorkingPatternItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WorkingPatternItem.belongsTo(models.WorkingPattern, {
        foreignKey: 'workingPatternId',
        as: 'working_pattern',
      });
    }
  }
  WorkingPatternItem.init(
    {
      workingPatternId: DataTypes.INTEGER,
      order: DataTypes.INTEGER,
      dayStatus: DataTypes.STRING,
      clockIn: DataTypes.TIME,
      clockOut: DataTypes.TIME,
      delayTolerance: DataTypes.SMALLINT,
    },
    {
      sequelize,
      modelName: 'WorkingPatternItem',
    },
  );
  return WorkingPatternItem;
};
