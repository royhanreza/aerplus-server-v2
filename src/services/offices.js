/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const models = require('../models');

const { Office } = models;

class OfficeService {
  static async getAll() {
    try {
      const offices = await Office.findAll();
      return { offices };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const office = await Office.findByPk(id);
      return office;
    } catch (error) {
      throw error;
    }
  }

  static async create(officeInputDTO) {
    // eslint-disable-next-line object-curly-newline
    const { name, phone, address, longitude, latitude } = officeInputDTO;

    try {
      const officeWithName = await Office.findOne({
        where: {
          name,
        },
      });

      if (officeWithName) {
        throw new Error('Nama kantor sudah digunakan');
      }

      const office = await Office.create({
        name,
        phone,
        address,
        longitude,
        latitude,
      });
      return office;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async update(officeInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const { name, phone, address, longitude, latitude } = officeInputDTO;

    try {
      // Check existing name
      const officeWithName = await Office.findOne({
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
        throw new Error('Nama kantor sudah digunakan');
      }

      await Office.update(
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

      const office = await Office.findByPk(Number(id));

      return office;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async delete(id) {
    try {
      await Office.destroy({
        where: { id: Number(id) },
      });

      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OfficeService;
