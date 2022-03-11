'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DailyPayslipTemplateDailySalaryDeductions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DailyPayslipTemplateDailySalaryDeductions.init({
    DailyPayslipTemplateId: DataTypes.INTEGER,
    DailySalaryDeductionId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DailyPayslipTemplateDailySalaryDeductions',
  });
  return DailyPayslipTemplateDailySalaryDeductions;
};