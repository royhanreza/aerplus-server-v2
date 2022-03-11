'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DailyPayslipTemplate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DailyPayslipTemplate.belongsToMany(models.DailySalaryIncome, {
        through: models.DailyPayslipTemplateDailySalaryIncomes,
        as: 'incomes',
      });
      DailyPayslipTemplate.belongsToMany(models.DailySalaryDeduction, {
        through: models.DailyPayslipTemplateDailySalaryDeductions,
        as: 'deductions',
      });
      DailyPayslipTemplate.hasMany(models.Employee, {
        as: 'employees',
      });
    }
  }
  DailyPayslipTemplate.init(
    {
      name: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'DailyPayslipTemplate',
    },
  );
  return DailyPayslipTemplate;
};
