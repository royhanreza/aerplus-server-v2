const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const EventCalendarService = require('../../services/eventcalendar');

dayjs.extend(utc);

const route = Router();
// const prisma = new PrismaClient();

const celebrateOptions = {
  abortEarly: false,
};

const EventCalendarServiceInstance = EventCalendarService;

module.exports = (app) => {
  app.use('/event-calendars', route);

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      const { eventCalendars } = await EventCalendarServiceInstance.getAll();

      return res.json({
        message: 'OK',
        data: eventCalendars,
      });
      // * Get data with pagination
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Get specific inspection data by id
   */
  route.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const eventCalendar = await EventCalendarServiceInstance.getById(
        Number(id),
      );

      return res.json({
        data: eventCalendar,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Add new eventCalendar data
   */
  route.post(
    '/',
    celebrate({
      [Segments.BODY]: Joi.object().options(celebrateOptions).keys({
        date: Joi.string().required(),
        name: Joi.string().required(),
        type: Joi.string().required(),
      }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const eventCalendarInputDTO = req.body;

        const eventCalendar = await EventCalendarServiceInstance.create({
          ...eventCalendarInputDTO,
        });

        return res.json({
          message: 'data has been saved successfully',
          data: eventCalendar,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Update eventCalendar data
   */
  route.post(
    '/:id',
    celebrate({
      [Segments.BODY]: Joi.object().options(celebrateOptions).keys({
        date: Joi.string().required(),
        name: Joi.string().required(),
        type: Joi.string().required(),
      }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const { id } = req.params;

        const eventCalendarInputDTO = req.body;

        const eventCalendar = await EventCalendarServiceInstance.update(
          {
            ...eventCalendarInputDTO,
          },
          id,
        );

        return res.json({
          message: 'data has been saved successfully',
          data: eventCalendar,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Delete eventCalendar data
   */
  route.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const eventCalendar = await EventCalendarServiceInstance.delete(
        Number(id),
      );

      return res.json({
        message: 'data has been deleted',
        data: eventCalendar,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });
};
