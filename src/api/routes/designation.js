const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const DesignationService = require('../../services/designation');

dayjs.extend(utc);

const route = Router();
// const prisma = new PrismaClient();

const celebrateOptions = {
  abortEarly: false,
};

const DesignationServiceInstance = DesignationService;

module.exports = (app) => {
  app.use('/designations', route);

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      const { designations } = await DesignationServiceInstance.getAll();

      return res.json({
        message: 'OK',
        data: designations,
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
      const designation = await DesignationServiceInstance.getById(Number(id));

      return res.json({
        data: designation,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Add new designation data
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
        const designationInputDTO = req.body;

        const designation = await DesignationServiceInstance.create({
          ...designationInputDTO,
        });

        return res.json({
          message: 'data has been saved successfully',
          data: designation,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Update designation data
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

        const designationInputDTO = req.body;

        const designation = await DesignationServiceInstance.update(
          {
            ...designationInputDTO,
          },
          id,
        );

        return res.json({
          message: 'data has been saved successfully',
          data: designation,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Delete designation data
   */
  route.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const designation = await DesignationServiceInstance.delete(Number(id));

      return res.json({
        message: 'data has been deleted',
        data: designation,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });
};
