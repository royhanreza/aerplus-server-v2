const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const DailySalaryDeductionService = require('../../services/dailysalarydeduction');

dayjs.extend(utc);

const route = Router();
// const prisma = new PrismaClient();

const celebrateOptions = {
  abortEarly: false,
};

const DailySalaryDeductionServiceInstance = DailySalaryDeductionService;

module.exports = (app) => {
  app.use('/daily-salary-deductions', route);

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      const { dailySalaryDeductions } =
        await DailySalaryDeductionServiceInstance.getAll();

      return res.json({
        message: 'OK',
        data: dailySalaryDeductions,
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
      const dailySalaryDeduction =
        await DailySalaryDeductionServiceInstance.getById(Number(id));

      return res.json({
        data: dailySalaryDeduction,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Add new dailySalaryDeduction data
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
        const dailySalaryDeductionInputDTO = req.body;

        const dailySalaryDeduction =
          await DailySalaryDeductionServiceInstance.create({
            ...dailySalaryDeductionInputDTO,
          });

        return res.json({
          message: 'data has been saved successfully',
          data: dailySalaryDeduction,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Update dailySalaryDeduction data
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

        const dailySalaryDeductionInputDTO = req.body;

        const dailySalaryDeduction =
          await DailySalaryDeductionServiceInstance.update(
            {
              ...dailySalaryDeductionInputDTO,
            },
            id,
          );

        return res.json({
          message: 'data has been saved successfully',
          data: dailySalaryDeduction,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Delete dailySalaryDeduction data
   */
  route.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const dailySalaryDeduction =
        await DailySalaryDeductionServiceInstance.delete(Number(id));

      return res.json({
        message: 'data has been deleted',
        data: dailySalaryDeduction,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });
};
