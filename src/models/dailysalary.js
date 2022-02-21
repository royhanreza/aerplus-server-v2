'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DailySalary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DailySalary.init(
    {
      title: DataTypes.STRING,
      employeeId: DataTypes.INTEGER,
      startDatePeriod: DataTypes.DATEONLY,
      endDatePeriod: DataTypes.DATEONLY,
      incomes: DataTypes.TEXT,
      deductions: DataTypes.TEXT,
      note: DataTypes.STRING,
      noteBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'DailySalary',
    },
  );
  return DailySalary;
};
