/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const models = require('../models');

const { JobLevel } = models;

class JobLevelService {
  static async getAll() {
    try {
      const jobLevels = await JobLevel.findAll();
      return { jobLevels };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const jobLevel = await JobLevel.findByPk(id);
      return jobLevel;
    } catch (error) {
      throw error;
    }
  }

  static async create(jobLevelInputDTO) {
    // eslint-disable-next-line object-curly-newline
    const { name, active } = jobLevelInputDTO;

    try {
      const jobLevelWithName = await JobLevel.findOne({
        where: {
          name,
        },
      });

      if (jobLevelWithName) {
        throw new Error('Nama job level sudah digunakan');
      }

      const jobLevel = await JobLevel.create({
        name,
        active,
      });
      return jobLevel;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async update(jobLevelInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const { name, active } = jobLevelInputDTO;

    try {
      // Check existing name
      const jobLevelWithName = await JobLevel.findOne({
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

      if (jobLevelWithName) {
        throw new Error('Nama job level sudah digunakan');
      }

      await JobLevel.update(
        {
          name,
          active,
        },
        {
          where: { id: Number(id) },
        },
      );

      const jobLevel = await JobLevel.findByPk(Number(id));

      return jobLevel;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async delete(id) {
    try {
      await JobLevel.destroy({
        where: { id: Number(id) },
      });

      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = JobLevelService;
