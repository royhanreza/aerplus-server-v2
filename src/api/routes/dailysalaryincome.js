const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const DailySalaryIncomeService = require('../../services/dailysalaryincome');

dayjs.extend(utc);

const route = Router();
// const prisma = new PrismaClient();

const celebrateOptions = {
  abortEarly: false,
};

const DailySalaryIncomeServiceInstance = DailySalaryIncomeService;

module.exports = (app) => {
  app.use('/daily-salary-incomes', route);

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      const { dailySalaryIncomes } =
        await DailySalaryIncomeServiceInstance.getAll();

      return res.json({
        message: 'OK',
        data: dailySalaryIncomes,
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
      const dailySalaryIncome = await DailySalaryIncomeServiceInstance.getById(
        Number(id),
      );

      return res.json({
        data: dailySalaryIncome,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Add new dailySalaryIncome data
   */
  route.post(
    '/',
    celebrate({
      [Segments.BODY]: Joi.object()
        .options(celebrateOptions)
        .keys({
          name: Joi.string().required(),
          type: Joi.string().required(),
          present_only: Joi.boolean().allow('', null),
          active: Joi.boolean().allow('', null),
          is_default: Joi.boolean().allow('', null),
        }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const dailySalaryIncomeInputDTO = req.body;

        const dailySalaryIncome = await DailySalaryIncomeServiceInstance.create(
          {
            ...dailySalaryIncomeInputDTO,
          },
        );

        return res.json({
          message: 'data has been saved successfully',
          data: dailySalaryIncome,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Update dailySalaryIncome data
   */
  route.post(
    '/:id',
    celebrate({
      [Segments.BODY]: Joi.object()
        .options(celebrateOptions)
        .keys({
          name: Joi.string().required(),
          type: Joi.string().required(),
          present_only: Joi.boolean().allow('', null),
          active: Joi.boolean().allow('', null),
          is_default: Joi.boolean().allow('', null),
        }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const { id } = req.params;

        const dailySalaryIncomeInputDTO = req.body;

        const dailySalaryIncome = await DailySalaryIncomeServiceInstance.update(
          {
            ...dailySalaryIncomeInputDTO,
          },
          id,
        );

        return res.json({
          message: 'data has been saved successfully',
          data: dailySalaryIncome,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Delete dailySalaryIncome data
   */
  route.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const dailySalaryIncome = await DailySalaryIncomeServiceInstance.delete(
        Number(id),
      );

      return res.json({
        message: 'data has been deleted',
        data: dailySalaryIncome,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });
};
