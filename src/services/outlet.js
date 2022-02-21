/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const models = require('../models');

const { Outlet } = models;

class OutletService {
  static async getAll() {
    try {
      const outlets = await Outlet.findAll();
      return { outlets };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const outlet = await Outlet.findByPk(id);
      return outlet;
    } catch (error) {
      throw error;
    }
  }

  static async create(outletInputDTO) {
    // eslint-disable-next-line object-curly-newline
    const { name, phone, address, longitude, latitude } = outletInputDTO;

    try {
      const outletWithName = await Outlet.findOne({
        where: {
          name,
        },
      });

      if (outletWithName) {
        throw new Error('Nama kantor sudah digunakan');
      }

      const outlet = await Outlet.create({
        name,
        phone,
        address,
        longitude,
        latitude,
      });
      return outlet;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async update(outletInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const { name, phone, address, longitude, latitude } = outletInputDTO;

    try {
      // Check existing name
      const outletWithName = await Outlet.findOne({
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

      if (outletWithName) {
        throw new Error('Nama kantor sudah digunakan');
      }

      await Outlet.update(
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

      const outlet = await Outlet.findByPk(Number(id));

      return outlet;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async delete(id) {
    try {
      await Outlet.destroy({
        where: { id: Number(id) },
      });

      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OutletService;
