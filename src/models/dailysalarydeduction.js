'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DailySalaryDeduction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DailySalaryDeduction.belongsToMany(models.DailyPayslipTemplate, {
        through: models.DailyPayslipTemplateDailySalaryDeductions,
        as: 'payslips',
      });
    }
  }
  DailySalaryDeduction.init(
    {
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      presentOnly: DataTypes.BOOLEAN,
      active: DataTypes.BOOLEAN,
      default: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'DailySalaryDeduction',
    },
  );
  return DailySalaryDeduction;
};
