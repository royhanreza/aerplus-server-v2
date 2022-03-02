/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const models = require('../models');

const { Organization } = models;

class OrganizationService {
  static async getAll() {
    try {
      const organizations = await Organization.findAll();
      return { organizations };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const organization = await Organization.findByPk(id);
      return organization;
    } catch (error) {
      throw error;
    }
  }

  static async create(organizationInputDTO) {
    // eslint-disable-next-line object-curly-newline
    const { name, active } = organizationInputDTO;

    try {
      const organizationWithName = await Organization.findOne({
        where: {
          name,
        },
      });

      if (organizationWithName) {
        throw new Error('Nama organisasi sudah digunakan');
      }

      const organization = await Organization.create({
        name,
        active,
      });
      return organization;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async update(organizationInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const { name, active } = organizationInputDTO;

    try {
      // Check existing name
      const organizationWithName = await Organization.findOne({
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

      if (organizationWithName) {
        throw new Error('Nama organisasi sudah digunakan');
      }

      await Organization.update(
        {
          name,
          active,
        },
        {
          where: { id: Number(id) },
        },
      );

      const organization = await Organization.findByPk(Number(id));

      return organization;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async delete(id) {
    try {
      await Organization.destroy({
        where: { id: Number(id) },
      });

      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OrganizationService;
