/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const models = require('../models');

const { JobTitle } = models;

class JobTitleService {
  static async getAll() {
    try {
      const jobTitles = await JobTitle.findAll();
      return { jobTitles };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const jobTitle = await JobTitle.findByPk(id);
      return jobTitle;
    } catch (error) {
      throw error;
    }
  }

  static async create(jobTitleInputDTO) {
    // eslint-disable-next-line object-curly-newline
    const { name, active } = jobTitleInputDTO;

    try {
      const jobTitleWithName = await JobTitle.findOne({
        where: {
          name,
        },
      });

      if (jobTitleWithName) {
        throw new Error('Nama job title sudah digunakan');
      }

      const jobTitle = await JobTitle.create({
        name,
        active,
      });
      return jobTitle;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async update(jobTitleInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const { name, active } = jobTitleInputDTO;

    try {
      // Check existing name
      const jobTitleWithName = await JobTitle.findOne({
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

      if (jobTitleWithName) {
        throw new Error('Nama job title sudah digunakan');
      }

      await JobTitle.update(
        {
          name,
          active,
        },
        {
          where: { id: Number(id) },
        },
      );

      const jobTitle = await JobTitle.findByPk(Number(id));

      return jobTitle;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async delete(id) {
    try {
      await JobTitle.destroy({
        where: { id: Number(id) },
      });

      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = JobTitleService;
