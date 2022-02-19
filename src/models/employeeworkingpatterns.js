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
      effectiveDate: {
        type: DataTypes.DATEONLY,
      },
      endDate: {
        type: DataTypes.DATEONLY,
      },
      daysTo: {
        type: DataTypes.SMALLINT,
      },
      workInHoliday: {
        type: DataTypes.BOOLEAN,
      },
      workInMassLeave: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: 'EmployeeWorkingPatterns',
    },
  );
  return EmployeeWorkingPatterns;
};
