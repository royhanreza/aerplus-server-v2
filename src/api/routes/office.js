const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const OfficeService = require('../../services/offices');

dayjs.extend(utc);

const route = Router();
// const prisma = new PrismaClient();

const celebrateOptions = {
  abortEarly: false,
};

const OfficeServiceInstance = OfficeService;

module.exports = (app) => {
  app.use('/offices', route);

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      const { offices } = await OfficeServiceInstance.getAll();

      return res.json({
        message: 'OK',
        data: offices,
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
      const office = await OfficeServiceInstance.getById(Number(id));

      return res.json({
        data: office,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Add new office data
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
        const officeInputDTO = req.body;

        const office = await OfficeServiceInstance.create({
          ...officeInputDTO,
        });

        return res.json({
          message: 'data has been saved successfully',
          data: office,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Update office data
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

        const officeInputDTO = req.body;

        const office = await OfficeServiceInstance.update(
          {
            ...officeInputDTO,
          },
          id,
        );

        return res.json({
          message: 'data has been saved successfully',
          data: office,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Delete office data
   */
  route.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const office = await OfficeServiceInstance.delete(Number(id));

      return res.json({
        message: 'data has been deleted',
        data: office,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });
};
