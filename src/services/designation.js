/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const models = require('../models');

const { Designation } = models;

class DesignationService {
  static async getAll() {
    try {
      const designations = await Designation.findAll();
      return { designations };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const designation = await Designation.findByPk(id);
      return designation;
    } catch (error) {
      throw error;
    }
  }

  static async create(designationInputDTO) {
    // eslint-disable-next-line object-curly-newline
    const { name, active } = designationInputDTO;

    try {
      const designationWithName = await Designation.findOne({
        where: {
          name,
        },
      });

      if (designationWithName) {
        throw new Error('Nama bagian sudah digunakan');
      }

      const designation = await Designation.create({
        name,
        active,
      });
      return designation;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async update(designationInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const { name, active } = designationInputDTO;

    try {
      // Check existing name
      const designationWithName = await Designation.findOne({
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

      if (designationWithName) {
        throw new Error('Nama bagian sudah digunakan');
      }

      await Designation.update(
        {
          name,
          active,
        },
        {
          where: { id: Number(id) },
        },
      );

      const designation = await Designation.findByPk(Number(id));

      return designation;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async delete(id) {
    try {
      await Designation.destroy({
        where: { id: Number(id) },
      });

      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DesignationService;
