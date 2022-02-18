/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const models = require('../models');

const { Department } = models;

class DepartmentService {
  static async getAll() {
    try {
      const departments = await Department.findAll();
      return { departments };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const department = await Department.findByPk(id);
      return department;
    } catch (error) {
      throw error;
    }
  }

  static async create(departmentInputDTO) {
    // eslint-disable-next-line object-curly-newline
    const { name, active } = departmentInputDTO;

    try {
      const departmentWithName = await Department.findOne({
        where: {
          name,
        },
      });

      if (departmentWithName) {
        throw new Error('Nama departemen sudah digunakan');
      }

      const department = await Department.create({
        name,
        active,
      });
      return department;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async update(departmentInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const { name, active } = departmentInputDTO;

    try {
      // Check existing name
      const departmentWithName = await Department.findOne({
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

      if (departmentWithName) {
        throw new Error('Nama departemen sudah digunakan');
      }

      await Department.update(
        {
          name,
          active,
        },
        {
          where: { id: Number(id) },
        },
      );

      const department = await Department.findByPk(Number(id));

      return department;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async delete(id) {
    try {
      await Department.destroy({
        where: { id: Number(id) },
      });

      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DepartmentService;
