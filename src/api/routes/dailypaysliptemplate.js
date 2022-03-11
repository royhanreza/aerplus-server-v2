const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const DailyPayslipTemplateService = require('../../services/dailypaysliptemplate');

dayjs.extend(utc);

const route = Router();
// const prisma = new PrismaClient();

const celebrateOptions = {
  abortEarly: false,
};

const DailyPayslipTemplateServiceInstance = DailyPayslipTemplateService;

module.exports = (app) => {
  app.use('/daily-payslip-templates', route);

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      const { dailyPayslipTemplates } =
        await DailyPayslipTemplateServiceInstance.getAll();

      return res.json({
        message: 'OK',
        data: dailyPayslipTemplates,
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
      const dailyPayslipTemplate =
        await DailyPayslipTemplateServiceInstance.getById(Number(id));

      return res.json({
        data: dailyPayslipTemplate,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Add new dailyPayslipTemplate data
   */
  route.post(
    '/',
    celebrate({
      [Segments.BODY]: Joi.object()
        .options(celebrateOptions)
        .keys({
          name: Joi.string().required(),
          incomes: Joi.array().items(
            Joi.object().keys({
              id: Joi.number().required(),
              amount: Joi.number().allow('', null),
            }),
          ),
          deductions: Joi.array().items(
            Joi.object().keys({
              id: Joi.number().required(),
              amount: Joi.number().allow('', null),
            }),
          ),
          //   phone: Joi.string().allow('', null),
        }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const dailyPayslipTemplateInputDTO = req.body;

        const dailyPayslipTemplate =
          await DailyPayslipTemplateServiceInstance.create({
            ...dailyPayslipTemplateInputDTO,
          });

        return res.json({
          message: 'data has been saved successfully',
          data: dailyPayslipTemplate,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Update dailyPayslipTemplate data
   */
  route.post(
    '/:id',
    celebrate({
      [Segments.BODY]: Joi.object()
        .options(celebrateOptions)
        .keys({
          name: Joi.string().required(),
          incomes: Joi.array().items(
            Joi.object().keys({
              id: Joi.number().required(),
              amount: Joi.number().allow('', null),
            }),
          ),
          deductions: Joi.array().items(
            Joi.object().keys({
              id: Joi.number().required(),
              amount: Joi.number().allow('', null),
            }),
          ),
          //   phone: Joi.string().allow('', null),
        }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const { id } = req.params;

        const dailyPayslipTemplateInputDTO = req.body;

        const dailyPayslipTemplate =
          await DailyPayslipTemplateServiceInstance.update(
            {
              ...dailyPayslipTemplateInputDTO,
            },
            id,
          );

        return res.json({
          message: 'data has been saved successfully',
          data: dailyPayslipTemplate,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Delete dailyPayslipTemplate data
   */
  route.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const dailyPayslipTemplate =
        await DailyPayslipTemplateServiceInstance.delete(Number(id));

      return res.json({
        message: 'data has been deleted',
        data: dailyPayslipTemplate,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });
};
