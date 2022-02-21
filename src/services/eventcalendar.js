/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const models = require('../models');

const { EventCalendar } = models;

class EventCalendarService {
  static async getAll() {
    try {
      const eventCalendars = await EventCalendar.findAll();
      return { eventCalendars };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const eventCalendar = await EventCalendar.findByPk(id);
      return eventCalendar;
    } catch (error) {
      throw error;
    }
  }

  static async create(eventCalendarInputDTO) {
    // eslint-disable-next-line object-curly-newline
    const { date, name, type } = eventCalendarInputDTO;

    try {
      const eventCalendarWithNameDate = await EventCalendar.findOne({
        where: {
          date,
          name,
        },
      });

      if (eventCalendarWithNameDate) {
        throw new Error('nama event dan tanggal sudah digunakan');
      }

      const eventCalendar = await EventCalendar.create({
        date,
        name,
        type,
      });
      return eventCalendar;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async update(eventCalendarInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const { date, name, type } = eventCalendarInputDTO;

    try {
      // Check existing name
      const eventCalendarWithName = await EventCalendar.findOne({
        where: {
          date,
          name,
          // active,
          [Op.not]: [
            {
              id: [Number(id)],
            },
          ],
        },
      });

      if (eventCalendarWithName) {
        throw new Error('nama event dan tanggal sudah digunakan');
      }

      await EventCalendar.update(
        {
          date,
          name,
          type,
        },
        {
          where: { id: Number(id) },
        },
      );

      const eventCalendar = await EventCalendar.findByPk(Number(id));

      return eventCalendar;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async delete(id) {
    try {
      await EventCalendar.destroy({
        where: { id: Number(id) },
      });

      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = EventCalendarService;
