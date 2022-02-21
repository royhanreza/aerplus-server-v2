const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const multer = require('multer');
const PermissionApplicationService = require('../../services/permissionapplication');

dayjs.extend(utc);

const route = Router();
// const prisma = new PrismaClient();

const celebrateOptions = {
  abortEarly: false,
};

const storage = multer.memoryStorage();

// const fileFilter = (req: any, file: any, cb: any) => {
//   if (file.mimetype.split("/")[0] === "image") {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images are allowed!"));
//   }
// };

const uploadManual = multer({
  storage,
  // fileFilter,
  limits: { fieldSize: 8 * 1024 * 1024 },
});

const PermissionApplicationServiceInstance = PermissionApplicationService;

module.exports = (app) => {
  app.use('/permission-applications', route);

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      const { permissionApplications } =
        await PermissionApplicationServiceInstance.getAll();

      return res.json({
        message: 'OK',
        data: permissionApplications,
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
      const permissionApplication =
        await PermissionApplicationServiceInstance.getById(Number(id));

      return res.json({
        data: permissionApplication,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Add new permissionApplication data
   */
  route.post(
    '/',
    uploadManual.single('attachment'),
    celebrate({
      [Segments.BODY]: Joi.object()
        .options(celebrateOptions)
        .keys({
          employee_id: Joi.number().required(),
          permission_category_id: Joi.number().required(),
          date: Joi.string().required(),
          permission_dates: Joi.string().required(),
          status: Joi.string().allow('', null),
          note: Joi.string().allow('', null),
        }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const permissionApplicationInputDTO = req.body;

        const permissionApplication =
          await PermissionApplicationServiceInstance.create(
            {
              ...permissionApplicationInputDTO,
            },
            req,
          );

        return res.json({
          message: 'data has been saved successfully',
          data: permissionApplication,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Update permissionApplication data
   */
  route.post(
    '/:id',
    uploadManual.single('attachment'),
    celebrate({
      [Segments.BODY]: Joi.object()
        .options(celebrateOptions)
        .keys({
          employee_id: Joi.number().required(),
          permission_category_id: Joi.number().required(),
          date: Joi.string().required(),
          permission_dates: Joi.string().required(),
          note: Joi.string().allow('', null),
        }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const { id } = req.params;

        const permissionApplicationInputDTO = req.body;

        const permissionApplication =
          await PermissionApplicationServiceInstance.update(
            {
              ...permissionApplicationInputDTO,
            },
            id,
            req,
          );

        return res.json({
          message: 'data has been saved successfully',
          data: permissionApplication,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Delete permissionApplication data
   */
  route.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const permissionApplication =
        await PermissionApplicationServiceInstance.delete(Number(id));

      return res.json({
        message: 'data has been deleted',
        data: permissionApplication,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Approve Permission Application
   */
  route.post(
    '/:id/approve',
    celebrate({
      [Segments.BODY]: Joi.object().options(celebrateOptions).keys({
        confirmed_by: Joi.number().required(),
      }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const { id } = req.params;

        const permissionApplicationInputDTO = req.body;

        const permissionApplication =
          await PermissionApplicationServiceInstance.approve(
            {
              ...permissionApplicationInputDTO,
            },
            id,
          );

        return res.json({
          message: 'data has been approved',
          data: permissionApplication,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Reject Permission Application
   */
  route.post(
    '/:id/reject',
    celebrate({
      [Segments.BODY]: Joi.object().options(celebrateOptions).keys({
        confirmed_by: Joi.number().required(),
      }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const { id } = req.params;

        const permissionApplicationInputDTO = req.body;

        const permissionApplication =
          await PermissionApplicationServiceInstance.reject(
            {
              ...permissionApplicationInputDTO,
            },
            id,
          );

        return res.json({
          message: 'data has been rejected',
          data: permissionApplication,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );
};
