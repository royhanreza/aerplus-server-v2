'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DailyPayslipTemplateDailySalaryIncomes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DailyPayslipTemplateDailySalaryIncomes.init(
    {
      DailyPayslipTemplateId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'DailyPayslipTemplates',
          key: 'id',
        },
      },
      DailySalaryIncomeId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'DailySalaryIncomes',
          key: 'id',
        },
      },
      amount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'DailyPayslipTemplateDailySalaryIncomes',
    },
  );
  return DailyPayslipTemplateDailySalaryIncomes;
};
