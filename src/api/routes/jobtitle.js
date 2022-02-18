const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const JobTitleService = require('../../services/jobtitle');

dayjs.extend(utc);

const route = Router();
// const prisma = new PrismaClient();

const celebrateOptions = {
  abortEarly: false,
};

const JobTitleServiceInstance = JobTitleService;

module.exports = (app) => {
  app.use('/job-titles', route);

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      const { jobTitles } = await JobTitleServiceInstance.getAll();

      return res.json({
        message: 'OK',
        data: jobTitles,
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
      const jobTitle = await JobTitleServiceInstance.getById(Number(id));

      return res.json({
        data: jobTitle,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Add new jobTitle data
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
        const jobTitleInputDTO = req.body;

        const jobTitle = await JobTitleServiceInstance.create({
          ...jobTitleInputDTO,
        });

        return res.json({
          message: 'data has been saved successfully',
          data: jobTitle,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Update jobTitle data
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

        const jobTitleInputDTO = req.body;

        const jobTitle = await JobTitleServiceInstance.update(
          {
            ...jobTitleInputDTO,
          },
          id,
        );

        return res.json({
          message: 'data has been saved successfully',
          data: jobTitle,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Delete jobTitle data
   */
  route.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const jobTitle = await JobTitleServiceInstance.delete(Number(id));

      return res.json({
        message: 'data has been deleted',
        data: jobTitle,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });
};
