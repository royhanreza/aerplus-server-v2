const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const multer = require('multer');
const LeaveApplicationService = require('../../services/leaveapplication');

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

const LeaveApplicationServiceInstance = LeaveApplicationService;

module.exports = (app) => {
  app.use('/leave-applications', route);

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      const { leaveApplications } =
        await LeaveApplicationServiceInstance.getAll();

      return res.json({
        message: 'OK',
        data: leaveApplications,
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
      const leaveApplication = await LeaveApplicationServiceInstance.getById(
        Number(id),
      );

      return res.json({
        data: leaveApplication,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Add new leaveApplication data
   */
  route.post(
    '/',
    uploadManual.single('attachment'),
    celebrate({
      [Segments.BODY]: Joi.object()
        .options(celebrateOptions)
        .keys({
          employee_id: Joi.number().required(),
          date: Joi.string().required(),
          leave_dates: Joi.string().required(),
          status: Joi.string().allow('', null),
          note: Joi.string().allow('', null),
        }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const leaveApplicationInputDTO = req.body;

        const leaveApplication = await LeaveApplicationServiceInstance.create(
          {
            ...leaveApplicationInputDTO,
          },
          req,
        );

        return res.json({
          message: 'data has been saved successfully',
          data: leaveApplication,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Update leaveApplication data
   */
  route.post(
    '/:id',
    uploadManual.single('attachment'),
    celebrate({
      [Segments.BODY]: Joi.object()
        .options(celebrateOptions)
        .keys({
          employee_id: Joi.number().required(),
          date: Joi.string().required(),
          leave_dates: Joi.string().required(),
          note: Joi.string().allow('', null),
        }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const { id } = req.params;

        const leaveApplicationInputDTO = req.body;

        const leaveApplication = await LeaveApplicationServiceInstance.update(
          {
            ...leaveApplicationInputDTO,
          },
          id,
          req,
        );

        return res.json({
          message: 'data has been saved successfully',
          data: leaveApplication,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Delete leaveApplication data
   */
  route.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const leaveApplication = await LeaveApplicationServiceInstance.delete(
        Number(id),
      );

      return res.json({
        message: 'data has been deleted',
        data: leaveApplication,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Approve Leave Application
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

        const leaveApplicationInputDTO = req.body;

        const leaveApplication = await LeaveApplicationServiceInstance.approve(
          {
            ...leaveApplicationInputDTO,
          },
          id,
        );

        return res.json({
          message: 'data has been approved',
          data: leaveApplication,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Reject Leave Application
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

        const leaveApplicationInputDTO = req.body;

        const leaveApplication = await LeaveApplicationServiceInstance.reject(
          {
            ...leaveApplicationInputDTO,
          },
          id,
        );

        return res.json({
          message: 'data has been rejected',
          data: leaveApplication,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );
};
