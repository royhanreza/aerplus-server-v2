const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const OutletService = require('../../services/outlet');

dayjs.extend(utc);

const route = Router();
// const prisma = new PrismaClient();

const celebrateOptions = {
  abortEarly: false,
};

const OutletServiceInstance = OutletService;

module.exports = (app) => {
  app.use('/outlets', route);

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      const { outlets } = await OutletServiceInstance.getAll();

      return res.json({
        message: 'OK',
        data: outlets,
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
      const outlet = await OutletServiceInstance.getById(Number(id));

      return res.json({
        data: outlet,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Add new outlet data
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
          latitude: Joi.string().allow('', null),
          longitude: Joi.string().allow('', null),
        }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const outletInputDTO = req.body;

        const outlet = await OutletServiceInstance.create({
          ...outletInputDTO,
        });

        return res.json({
          message: 'data has been saved successfully',
          data: outlet,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Update outlet data
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
          latitude: Joi.string().allow('', null),
          longitude: Joi.string().allow('', null),
        }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const { id } = req.params;

        const outletInputDTO = req.body;

        const outlet = await OutletServiceInstance.update(
          {
            ...outletInputDTO,
          },
          id,
        );

        return res.json({
          message: 'data has been saved successfully',
          data: outlet,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Delete outlet data
   */
  route.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const outlet = await OutletServiceInstance.delete(Number(id));

      return res.json({
        message: 'data has been deleted',
        data: outlet,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });
};
