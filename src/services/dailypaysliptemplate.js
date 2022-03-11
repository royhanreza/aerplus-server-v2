/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const models = require('../models');
const sequelizeLoader = require('../loaders/sequelize');

const {
  DailyPayslipTemplate,
  DailySalaryIncome,
  DailySalaryDeduction,
  DailyPayslipTemplateDailySalaryIncomes,
  DailyPayslipTemplateDailySalaryDeductions,
} = models;

class DailyPayslipTemplateService {
  static async getAll() {
    try {
      const dailyPayslipTemplates = await DailyPayslipTemplate.findAll({
        include: [
          {
            model: DailySalaryIncome,
            as: 'incomes',
            // through: { where: { active: true }, order: [['id', 'ASC']] },
          },
          {
            model: DailySalaryDeduction,
            as: 'deductions',
            // through: { where: { active: true }, order: [['id', 'ASC']] },
          },
        ],
      });
      return { dailyPayslipTemplates };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const dailyPayslipTemplate = await DailyPayslipTemplate.findByPk(id, {
        include: [
          {
            model: DailySalaryIncome,
            as: 'incomes',
            // through: { where: { active: true }, order: [['id', 'ASC']] },
          },
          {
            model: DailySalaryDeduction,
            as: 'deductions',
            // through: { where: { active: true }, order: [['id', 'ASC']] },
          },
        ],
      });
      return dailyPayslipTemplate;
    } catch (error) {
      throw error;
    }
  }

  static async create(dailyPayslipTemplateInputDTO) {
    // eslint-disable-next-line object-curly-newline
    const { name, incomes, deductions } = dailyPayslipTemplateInputDTO;

    const transaction = await sequelizeLoader.transaction();
    try {
      const dailyPayslipTemplateWithName = await DailyPayslipTemplate.findOne({
        where: {
          name,
        },
      });

      if (dailyPayslipTemplateWithName) {
        throw new Error('Nama slip gaji sudah digunakan');
      }

      const dailyPayslipTemplate = await DailyPayslipTemplate.create(
        {
          name,
        },
        { transaction },
      );

      const payslipId = dailyPayslipTemplate.id;
      // Insert incomes
      let newIncomes = [];
      if (Array.isArray(incomes)) {
        newIncomes = incomes.map((income) => ({
          DailyPayslipTemplateId: payslipId,
          DailySalaryIncomeId: income.id,
          amount: income.amount,
        }));

        await DailyPayslipTemplateDailySalaryIncomes.bulkCreate(newIncomes, {
          transaction,
        });
      }

      // Insert deductions
      let newDeductions = [];
      if (Array.isArray(deductions)) {
        newDeductions = deductions.map((deduction) => ({
          DailyPayslipTemplateId: payslipId,
          DailySalaryDeductionId: deduction.id,
          amount: deduction.amount,
        }));

        await DailyPayslipTemplateDailySalaryDeductions.bulkCreate(
          newDeductions,
          { transaction },
        );
      }

      await transaction.commit();

      const newDailyPayslipTemplate = await DailyPayslipTemplate.findByPk(
        payslipId,
        {
          include: ['incomes', 'deductions'],
        },
      );

      return newDailyPayslipTemplate;
    } catch (e) {
      await transaction.rollback();
      throw e.message || e;
    }
  }

  static async update(dailyPayslipTemplateInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const { name, incomes, deductions } = dailyPayslipTemplateInputDTO;

    const transaction = await sequelizeLoader.transaction();

    try {
      // Check existing name
      const dailyPayslipTemplateWithName = await DailyPayslipTemplate.findOne({
        where: {
          name,
          // active,
          [Op.not]: [
            {
              id: [Number(id)],
            },
          ],
        },
      });

      if (dailyPayslipTemplateWithName) {
        throw new Error('Nama kantor sudah digunakan');
      }

      await DailyPayslipTemplate.update(
        {
          name,
        },
        {
          where: { id: Number(id) },
          transaction,
        },
      );

      const payslipId = id;

      // Delete incomes & deductions
      await DailyPayslipTemplateDailySalaryIncomes.destroy({
        where: { DailyPayslipTemplateId: Number(id) },
        transaction,
      });
      await DailyPayslipTemplateDailySalaryDeductions.destroy({
        where: { DailyPayslipTemplateId: Number(id) },
        transaction,
      });

      // Insert incomes
      let newIncomes = [];
      if (Array.isArray(incomes)) {
        newIncomes = incomes.map((income) => ({
          DailyPayslipTemplateId: payslipId,
          DailySalaryIncomeId: income.id,
          amount: income.amount,
        }));

        await DailyPayslipTemplateDailySalaryIncomes.bulkCreate(newIncomes, {
          transaction,
        });
      }

      // Insert deductions
      let newDeductions = [];
      if (Array.isArray(deductions)) {
        newDeductions = deductions.map((deduction) => ({
          DailyPayslipTemplateId: payslipId,
          DailySalaryDeductionId: deduction.id,
          amount: deduction.amount,
        }));

        await DailyPayslipTemplateDailySalaryDeductions.bulkCreate(
          newDeductions,
          { transaction },
        );
      }

      await transaction.commit();

      const newDailyPayslipTemplate = await DailyPayslipTemplate.findByPk(
        Number(id),
        {
          include: ['incomes', 'deductions'],
        },
      );

      return newDailyPayslipTemplate;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async delete(id) {
    try {
      await DailyPayslipTemplate.destroy({
        where: { id: Number(id) },
      });

      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DailyPayslipTemplateService;
