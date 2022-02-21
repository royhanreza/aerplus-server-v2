const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const PermissionCategoryService = require('../../services/permissioncategory');

dayjs.extend(utc);

const route = Router();
// const prisma = new PrismaClient();

const celebrateOptions = {
  abortEarly: false,
};

const PermissionCategoryServiceInstance = PermissionCategoryService;

module.exports = (app) => {
  app.use('/permission-categories', route);

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      const { permissionCategories } =
        await PermissionCategoryServiceInstance.getAll();

      return res.json({
        message: 'OK',
        data: permissionCategories,
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
      const permissionCategory =
        await PermissionCategoryServiceInstance.getById(Number(id));

      return res.json({
        data: permissionCategory,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Add new permissionCategory data
   */
  route.post(
    '/',
    celebrate({
      [Segments.BODY]: Joi.object().options(celebrateOptions).keys({
        name: Joi.string().required(),
        max_day: Joi.number().required(),
      }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const officeInputDTO = req.body;

        const permissionCategory =
          await PermissionCategoryServiceInstance.create({
            ...officeInputDTO,
          });

        return res.json({
          message: 'data has been saved successfully',
          data: permissionCategory,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Update permissionCategory data
   */
  route.post(
    '/:id',
    celebrate({
      [Segments.BODY]: Joi.object().options(celebrateOptions).keys({
        name: Joi.string().required(),
        max_day: Joi.number().required(),
        active: Joi.number(),
      }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const { id } = req.params;

        const officeInputDTO = req.body;

        const permissionCategory =
          await PermissionCategoryServiceInstance.update(
            {
              ...officeInputDTO,
            },
            id,
          );

        return res.json({
          message: 'data has been saved successfully',
          data: permissionCategory,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Delete permissionCategory data
   */
  route.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const permissionCategory = await PermissionCategoryServiceInstance.delete(
        Number(id),
      );

      return res.json({
        message: 'data has been deleted',
        data: permissionCategory,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });
};
