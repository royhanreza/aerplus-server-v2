// 'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WorkingPattern extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WorkingPattern.hasMany(models.WorkingPatternItem, {
        as: 'items',
        onDelete: 'cascade',
      });
      WorkingPattern.belongsToMany(models.Employee, {
        through: models.EmployeeWorkingPatterns,
        as: 'employees',
      });
    }
  }
  WorkingPattern.init(
    {
      name: DataTypes.STRING,
      numberOfDays: DataTypes.SMALLINT,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'WorkingPattern',
    },
  );
  return WorkingPattern;
};
