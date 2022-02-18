/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const sequelize = require('../loaders/sequelize');
const models = require('../models');

const { WorkingPattern, WorkingPatternItem } = models;

class WorkingPatternService {
  static async getAll() {
    try {
      const workingPatterns = await WorkingPattern.findAll({
        include: 'items',
      });
      return { workingPatterns };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const workingPattern = await WorkingPattern.findByPk(id);
      return workingPattern;
    } catch (error) {
      throw error;
    }
  }

  static async create(workingPatternInputDTO) {
    // eslint-disable-next-line object-curly-newline
    const { name, number_of_days, items } = workingPatternInputDTO;

    const t = await sequelize.transaction();

    try {
      const workingPatternWithName = await WorkingPattern.findOne({
        where: {
          name,
        },
      });

      if (workingPatternWithName) {
        throw new Error('Nama pola kerja sudah digunakan');
      }

      const workingPattern = await WorkingPattern.create(
        {
          name,
          numberOfDays: number_of_days,
        },
        { transaction: t },
      );

      const workingPatternItems = items.map((item) => ({
        workingPatternId: workingPattern.id,
        order: item.order,
        dayStatus: item.day_status,
        clockIn: item.clock_in,
        clockOut: item.clock_out,
        delayTolerance: item.delay_tolerance,
      }));

      if (Array.isArray(workingPatternItems)) {
        await WorkingPatternItem.bulkCreate(workingPatternItems, {
          transaction: t,
        });
      }

      t.commit();

      return workingPattern;
    } catch (e) {
      t.rollback();
      throw e.message || e;
    }
  }

  static async update(workingPatternInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const { name, phone, address, longitude, latitude } =
      workingPatternInputDTO;

    try {
      // Check existing name
      const workingPatternWithName = await WorkingPattern.findOne({
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

      if (workingPatternWithName) {
        throw new Error('Nama pola kerja sudah digunakan');
      }

      await WorkingPattern.update(
        {
          name,
          phone,
          address,
          longitude,
          latitude,
        },
        {
          where: { id: Number(id) },
        },
      );

      const workingPattern = await WorkingPattern.findByPk(Number(id));

      return workingPattern;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async delete(id) {
    try {
      await WorkingPattern.destroy({
        where: { id: Number(id) },
      });

      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = WorkingPatternService;
