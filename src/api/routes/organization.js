const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const OrganizationService = require('../../services/organization');

dayjs.extend(utc);

const route = Router();
// const prisma = new PrismaClient();

const celebrateOptions = {
  abortEarly: false,
};

const OrganizationServiceInstance = OrganizationService;

module.exports = (app) => {
  app.use('/organizations', route);

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      const { organizations } = await OrganizationServiceInstance.getAll();

      return res.json({
        message: 'OK',
        data: organizations,
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
      const organization = await OrganizationServiceInstance.getById(
        Number(id),
      );

      return res.json({
        data: organization,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Add new organization data
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
        const organizationInputDTO = req.body;

        const organization = await OrganizationServiceInstance.create({
          ...organizationInputDTO,
        });

        return res.json({
          message: 'data has been saved successfully',
          data: organization,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Update organization data
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

        const organizationInputDTO = req.body;

        const organization = await OrganizationServiceInstance.update(
          {
            ...organizationInputDTO,
          },
          id,
        );

        return res.json({
          message: 'data has been saved successfully',
          data: organization,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Delete organization data
   */
  route.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const organization = await OrganizationServiceInstance.delete(Number(id));

      return res.json({
        message: 'data has been deleted',
        data: organization,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });
};
