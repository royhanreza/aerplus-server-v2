// 'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmployeeWorkingPatterns extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmployeeWorkingPatterns.init(
    {
      EmployeeId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Employees',
          key: 'id',
        },
      },
      WorkingPatternId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'WorkingPatterns',
          key: 'id',
        },
      },
      active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'EmployeeWorkingPatterns',
    },
  );
  return EmployeeWorkingPatterns;
};
