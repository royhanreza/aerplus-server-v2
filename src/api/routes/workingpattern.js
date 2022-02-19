const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const WorkingPatternService = require('../../services/workingpattern');

dayjs.extend(utc);

const route = Router();
// const prisma = new PrismaClient();

const celebrateOptions = {
  abortEarly: false,
};

const WorkingPatternServiceInstance = WorkingPatternService;

module.exports = (app) => {
  app.use('/working-patterns', route);

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      const { workingPatterns } = await WorkingPatternServiceInstance.getAll();

      return res.json({
        message: 'OK',
        data: workingPatterns,
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
      const workingPattern = await WorkingPatternServiceInstance.getById(
        Number(id),
      );

      return res.json({
        data: workingPattern,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Add new workingPattern data
   */
  route.post(
    '/',
    celebrate({
      [Segments.BODY]: Joi.object()
        .options(celebrateOptions)
        .keys({
          name: Joi.string().required(),
          number_of_days: Joi.number().required(),
          items: Joi.array().items(
            Joi.object().keys({
              order: Joi.number().required(),
              day_status: Joi.string().required(),
              clock_in: Joi.string().allow('', null).required(),
              clock_out: Joi.string().allow('', null).required(),
              delay_tolerance: Joi.number().default(0),
            }),
          ),
        }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const workingPatternInputDTO = req.body;

        const workingPattern = await WorkingPatternServiceInstance.create({
          ...workingPatternInputDTO,
        });

        return res.json({
          message: 'data has been saved successfully',
          data: workingPattern,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Update workingPattern data
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

        const workingPatternInputDTO = req.body;

        const workingPattern = await WorkingPatternServiceInstance.update(
          {
            ...workingPatternInputDTO,
          },
          id,
        );

        return res.json({
          message: 'data has been saved successfully',
          data: workingPattern,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Delete workingPattern data
   */
  route.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const workingPattern = await WorkingPatternServiceInstance.delete(
        Number(id),
      );

      return res.json({
        message: 'data has been deleted',
        data: workingPattern,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });
};
