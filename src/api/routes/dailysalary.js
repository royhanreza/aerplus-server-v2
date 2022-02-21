const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const DailySalaryService = require('../../services/dailysalary');

dayjs.extend(utc);

const route = Router();
// const prisma = new PrismaClient();

const celebrateOptions = {
  abortEarly: false,
};

const DailySalaryServiceInstance = DailySalaryService;

module.exports = (app) => {
  app.use('/daily-salaries', route);

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      const { dailySalaries } = await DailySalaryServiceInstance.getAll();

      return res.json({
        message: 'OK',
        data: dailySalaries,
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
      const dailySalary = await DailySalaryServiceInstance.getById(Number(id));

      return res.json({
        data: dailySalary,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Add new dailySalary data
   */
  route.post(
    '/',
    celebrate({
      [Segments.BODY]: Joi.object()
        .options(celebrateOptions)
        .keys({
          name: Joi.string().required(),
          phone: Joi.string().allow('', null),
          address: Joi.string().required(),
          latitude: Joi.string().required(),
          longitude: Joi.string().required(),
        }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const dailySalaryInputDTO = req.body;

        const dailySalary = await DailySalaryServiceInstance.create({
          ...dailySalaryInputDTO,
        });

        return res.json({
          message: 'data has been saved successfully',
          data: dailySalary,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Update dailySalary data
   */
  route.post(
    '/:id',
    celebrate({
      [Segments.BODY]: Joi.object()
        .options(celebrateOptions)
        .keys({
          name: Joi.string().required(),
          phone: Joi.string().allow('', null),
          address: Joi.string().required(),
          latitude: Joi.string().required(),
          longitude: Joi.string().required(),
        }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const { id } = req.params;

        const dailySalaryInputDTO = req.body;

        const dailySalary = await DailySalaryServiceInstance.update(
          {
            ...dailySalaryInputDTO,
          },
          id,
        );

        return res.json({
          message: 'data has been saved successfully',
          data: dailySalary,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Delete dailySalary data
   */
  route.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const dailySalary = await DailySalaryServiceInstance.delete(Number(id));

      return res.json({
        message: 'data has been deleted',
        data: dailySalary,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Generate daily salaries
   */
  route.get('/action/generate', async (req, res, next) => {
    try {
      const { start_date, end_date } = req.query;
      const dailySalaries = await DailySalaryServiceInstance.generate(
        start_date,
        end_date,
      );

      return res.json({
        message: 'OK',
        data: dailySalaries,
      });
      // * Get data with pagination
    } catch (error) {
      next(error);
    }

    return null;
  });
};
