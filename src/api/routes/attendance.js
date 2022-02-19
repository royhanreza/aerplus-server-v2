const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const multer = require('multer');
const AttendanceService = require('../../services/attendance');

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

const AttendanceServiceInstance = AttendanceService;

module.exports = (app) => {
  app.use('/attendances', route);

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      const { attendances } = await AttendanceServiceInstance.getAll();

      return res.json({
        message: 'OK',
        data: attendances,
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
      const attendance = await AttendanceServiceInstance.getById(Number(id));

      return res.json({
        data: attendance,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Add new attendance data
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
        const attendanceInputDTO = req.body;

        const attendance = await AttendanceServiceInstance.create({
          ...attendanceInputDTO,
        });

        return res.json({
          message: 'data has been saved successfully',
          data: attendance,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Update attendance data
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

        const attendanceInputDTO = req.body;

        const attendance = await AttendanceServiceInstance.update(
          {
            ...attendanceInputDTO,
          },
          id,
        );

        return res.json({
          message: 'data has been saved successfully',
          data: attendance,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Delete attendance data
   */
  route.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const attendance = await AttendanceServiceInstance.delete(Number(id));

      return res.json({
        message: 'data has been deleted',
        data: attendance,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Get all employee data with pagination
   */
  route.post(
    '/action/clockin',
    uploadManual.single('attachment'),
    celebrate({
      [Segments.BODY]: Joi.object()
        .options(celebrateOptions)
        .keys({
          employee_id: Joi.number().required(),
          date: Joi.string().required(),
          clock_in: Joi.string().required(),
          clock_in_at: Joi.string().required(),
          clock_in_ip_address: Joi.string().allow('', null),
          clock_in_device_detail: Joi.string().allow('', null),
          clock_in_latitude: Joi.string().allow('', null),
          clock_in_longitude: Joi.string().allow('', null),
          clock_in_office_latitude: Joi.string().allow('', null),
          clock_in_office_longitude: Joi.string().allow('', null),
          note: Joi.string().allow('', null),
        }),
    }),
    async (req, res, next) => {
      try {
        const attendanceInputDTO = req.body;

        const attendance = await AttendanceServiceInstance.clockIn(
          {
            ...attendanceInputDTO,
          },
          req,
        );

        return res.json({
          message: 'data has been saved successfully',
          data: attendance,
        });
        // * Get data with pagination
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Get all employee data with pagination
   */
  route.post(
    '/action/clockout',
    uploadManual.single('attachment'),
    celebrate({
      [Segments.BODY]: Joi.object()
        .options(celebrateOptions)
        .keys({
          employee_id: Joi.number().required(),
          date: Joi.string().required(),
          clock_out: Joi.string().required(),
          clock_out_at: Joi.string().required(),
          clock_out_ip_address: Joi.string().allow('', null),
          clock_out_device_detail: Joi.string().allow('', null),
          clock_out_latitude: Joi.string().allow('', null),
          clock_out_longitude: Joi.string().allow('', null),
          clock_out_office_latitude: Joi.string().allow('', null),
          clock_out_office_longitude: Joi.string().allow('', null),
          note: Joi.string().allow('', null),
        }),
    }),
    async (req, res, next) => {
      try {
        const attendanceInputDTO = req.body;

        const attendance = await AttendanceServiceInstance.clockOut(
          {
            ...attendanceInputDTO,
          },
          req,
        );

        return res.json({
          message: 'data has been saved successfully',
          data: attendance,
        });
        // * Get data with pagination
      } catch (error) {
        next(error);
      }

      return null;
    },
  );
};
