/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const models = require('../models');

const { PermissionCategory } = models;

class PermissionCategoryService {
  static async getAll() {
    try {
      const permissionCategories = await PermissionCategory.findAll();
      return { permissionCategories };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const permissionCategory = await PermissionCategory.findByPk(id);
      return permissionCategory;
    } catch (error) {
      throw error;
    }
  }

  static async create(officeInputDTO) {
    // eslint-disable-next-line object-curly-newline
    const { name, max_day } = officeInputDTO;

    try {
      const officeWithName = await PermissionCategory.findOne({
        where: {
          name,
        },
      });

      if (officeWithName) {
        throw new Error('Nama jenis izin sudah digunakan');
      }

      const permissionCategory = await PermissionCategory.create({
        name,
        maxDay: max_day,
      });
      return permissionCategory;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async update(officeInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const { name, max_day, active } = officeInputDTO;

    try {
      // Check existing name
      const officeWithName = await PermissionCategory.findOne({
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

      if (officeWithName) {
        throw new Error('Nama jenis izin sudah digunakan');
      }

      await PermissionCategory.update(
        {
          name,
          maxDay: max_day,
          active,
        },
        {
          where: { id: Number(id) },
        },
      );

      const permissionCategory = await PermissionCategory.findByPk(Number(id));

      return permissionCategory;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async delete(id) {
    try {
      await PermissionCategory.destroy({
        where: { id: Number(id) },
      });

      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PermissionCategoryService;
