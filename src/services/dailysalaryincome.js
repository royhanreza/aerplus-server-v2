/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const models = require('../models');

const { DailySalaryIncome } = models;

class DailySalaryIncomeService {
  static async getAll() {
    try {
      const dailySalaryIncomes = await DailySalaryIncome.findAll();
      return { dailySalaryIncomes };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const dailySalaryIncome = await DailySalaryIncome.findByPk(id);
      return dailySalaryIncome;
    } catch (error) {
      throw error;
    }
  }

  static async create(dailySalaryIncomeInputDTO) {
    // eslint-disable-next-line object-curly-newline
    const { name, type, present_only, active, is_default } =
      dailySalaryIncomeInputDTO;

    try {
      const dailySalaryIncomeWithName = await DailySalaryIncome.findOne({
        where: {
          name,
        },
      });

      if (dailySalaryIncomeWithName) {
        throw new Error('Nama komponen sudah digunakan');
      }

      const dailySalaryIncome = await DailySalaryIncome.create({
        name,
        type,
        presentOnly: present_only,
        active,
        default: is_default,
      });
      return dailySalaryIncome;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async update(dailySalaryIncomeInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const { name, type, present_only, active, is_default } =
      dailySalaryIncomeInputDTO;

    try {
      // Check existing name
      const dailySalaryIncomeWithName = await DailySalaryIncome.findOne({
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

      if (dailySalaryIncomeWithName) {
        throw new Error('Nama komponen sudah digunakan');
      }

      await DailySalaryIncome.update(
        {
          name,
          type,
          presentOnly: present_only,
          active,
          default: is_default,
        },
        {
          where: { id: Number(id) },
        },
      );

      const dailySalaryIncome = await DailySalaryIncome.findByPk(Number(id));

      return dailySalaryIncome;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async delete(id) {
    try {
      await DailySalaryIncome.destroy({
        where: { id: Number(id) },
      });

      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DailySalaryIncomeService;
