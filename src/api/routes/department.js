const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const DepartmentService = require('../../services/department');

dayjs.extend(utc);

const route = Router();
// const prisma = new PrismaClient();

const celebrateOptions = {
  abortEarly: false,
};

const DepartmentServiceInstance = DepartmentService;

module.exports = (app) => {
  app.use('/departments', route);

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      const { departments } = await DepartmentServiceInstance.getAll();

      return res.json({
        message: 'OK',
        data: departments,
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
      const department = await DepartmentServiceInstance.getById(Number(id));

      return res.json({
        data: department,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Add new department data
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
        const departmentInputDTO = req.body;

        const department = await DepartmentServiceInstance.create({
          ...departmentInputDTO,
        });

        return res.json({
          message: 'data has been saved successfully',
          data: department,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Update department data
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

        const departmentInputDTO = req.body;

        const department = await DepartmentServiceInstance.update(
          {
            ...departmentInputDTO,
          },
          id,
        );

        return res.json({
          message: 'data has been saved successfully',
          data: department,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Delete department data
   */
  route.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const department = await DepartmentServiceInstance.delete(Number(id));

      return res.json({
        message: 'data has been deleted',
        data: department,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });
};
