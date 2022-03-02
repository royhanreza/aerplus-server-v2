const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const JobLevelService = require('../../services/joblevel');

dayjs.extend(utc);

const route = Router();
// const prisma = new PrismaClient();

const celebrateOptions = {
  abortEarly: false,
};

const JobLevelServiceInstance = JobLevelService;

module.exports = (app) => {
  app.use('/job-levels', route);

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      const { jobLevels } = await JobLevelServiceInstance.getAll();

      return res.json({
        message: 'OK',
        data: jobLevels,
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
      const jobLevel = await JobLevelServiceInstance.getById(Number(id));

      return res.json({
        data: jobLevel,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Add new jobLevel data
   */
  route.post(
    '/',
    celebrate({
      [Segments.BODY]: Joi.object().options(celebrateOptions).keys({
        name: Joi.string().required(),
        active: Joi.number(),
      }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const jobLevelInputDTO = req.body;

        const jobLevel = await JobLevelServiceInstance.create({
          ...jobLevelInputDTO,
        });

        return res.json({
          message: 'data has been saved successfully',
          data: jobLevel,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Update jobLevel data
   */
  route.post(
    '/:id',
    celebrate({
      [Segments.BODY]: Joi.object().options(celebrateOptions).keys({
        name: Joi.string().required(),
        active: Joi.number(),
      }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const { id } = req.params;

        const jobLevelInputDTO = req.body;

        const jobLevel = await JobLevelServiceInstance.update(
          {
            ...jobLevelInputDTO,
          },
          id,
        );

        return res.json({
          message: 'data has been saved successfully',
          data: jobLevel,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Delete jobLevel data
   */
  route.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const jobLevel = await JobLevelServiceInstance.delete(Number(id));

      return res.json({
        message: 'data has been deleted',
        data: jobLevel,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });
};
