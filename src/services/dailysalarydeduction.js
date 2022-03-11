/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const models = require('../models');

const { DailySalaryDeduction } = models;

class DailySalaryDeductionService {
  static async getAll() {
    try {
      const dailySalaryDeductions = await DailySalaryDeduction.findAll();
      return { dailySalaryDeductions };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const dailySalaryDeduction = await DailySalaryDeduction.findByPk(id);
      return dailySalaryDeduction;
    } catch (error) {
      throw error;
    }
  }

  static async create(dailySalaryDeductionInputDTO) {
    // eslint-disable-next-line object-curly-newline
    const { name, type, present_only, active, is_default } =
      dailySalaryDeductionInputDTO;

    try {
      const dailySalaryDeductionWithName = await DailySalaryDeduction.findOne({
        where: {
          name,
        },
      });

      if (dailySalaryDeductionWithName) {
        throw new Error('Nama komponen sudah digunakan');
      }

      const dailySalaryDeduction = await DailySalaryDeduction.create({
        name,
        type,
        presentOnly: present_only,
        active,
        default: is_default,
      });
      return dailySalaryDeduction;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async update(dailySalaryDeductionInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const { name, type, present_only, active, is_default } =
      dailySalaryDeductionInputDTO;

    try {
      // Check existing name
      const dailySalaryDeductionWithName = await DailySalaryDeduction.findOne({
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

      if (dailySalaryDeductionWithName) {
        throw new Error('Nama komponen sudah digunakan');
      }

      await DailySalaryDeduction.update(
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

      const dailySalaryDeduction = await DailySalaryDeduction.findByPk(
        Number(id),
      );

      return dailySalaryDeduction;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async delete(id) {
    try {
      await DailySalaryDeduction.destroy({
        where: { id: Number(id) },
      });

      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DailySalaryDeductionService;
