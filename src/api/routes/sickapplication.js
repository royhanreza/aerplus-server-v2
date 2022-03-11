const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const multer = require('multer');
const SickApplicationService = require('../../services/sickapplication');
const { cleanQueryFilter } = require('../../helpers');

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

const SickApplicationServiceInstance = SickApplicationService;

module.exports = (app) => {
  app.use('/sick-applications', route);

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      // const { sickApplications } =
      //   await SickApplicationServiceInstance.getAll();

      // return res.json({
      //   message: 'OK',
      //   data: sickApplications,
      // });
      // * Get data with pagination

      const { id } = req.params;
      const pagination = req.query.pagination || false;
      const orderBy = cleanQueryFilter(req.query.order_by, ['date'], 'date');
      const orderIn = cleanQueryFilter(
        req.query.order_in,
        ['desc', 'asc'],
        'asc',
      );
      const startDate = cleanQueryFilter(req.query.start_date, [], null);
      const endDate = cleanQueryFilter(req.query.end_date, [], null);

      const filter = {
        orderBy,
        orderIn,
        startDate: startDate && new Date(startDate),
        endDate: endDate && dayjs.utc(endDate).add(1, 'day').format(),
      };

      // return res.send(filter);

      // * Get data without pagination
      if (!pagination || pagination !== 'true') {
        const { sickApplications } =
          await SickApplicationServiceInstance.getAll(filter);

        return res.json({
          data: sickApplications,
        });
        // * Get data with pagination
      }

      const { page } = req.query;
      if (!page || Number.isNaN(page)) {
        return res.status(400).send({
          message: '"page" query is required & must be a number',
        });
      }

      const perPage = req.query.per_page;
      if (!perPage || Number.isNaN(perPage)) {
        return res.status(400).send({
          message: '"perPage" query is required & must be a number',
        });
      }

      // eslint-disable-next-line operator-linebreak
      const { sickApplications, total } =
        await SickApplicationServiceInstance.getPaginated(
          Number(page),
          Number(perPage),
          filter,
        );

      return res.json({
        data: sickApplications,
        total,
      });
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
      const sickApplication = await SickApplicationServiceInstance.getById(
        Number(id),
      );

      return res.json({
        data: sickApplication,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Add new sickApplication data
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
          sick_dates: Joi.string().required(),
          status: Joi.string().allow('', null),
          note: Joi.string().allow('', null),
          attachment: Joi.string().allow('', null),
        }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const sickApplicationInputDTO = req.body;

        const sickApplication = await SickApplicationServiceInstance.create(
          {
            ...sickApplicationInputDTO,
          },
          req,
        );

        return res.json({
          message: 'data has been saved successfully',
          data: sickApplication,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Update sickApplication data
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
          sick_dates: Joi.string().required(),
          note: Joi.string().allow('', null),
          attachment: Joi.string().allow('', null),
          old_attachment: Joi.string().allow('', null),
        }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const { id } = req.params;

        const sickApplicationInputDTO = req.body;

        const sickApplication = await SickApplicationServiceInstance.update(
          {
            ...sickApplicationInputDTO,
          },
          id,
          req,
        );

        return res.json({
          message: 'data has been saved successfully',
          data: sickApplication,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Delete sickApplication data
   */
  route.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const sickApplication = await SickApplicationServiceInstance.delete(
        Number(id),
      );

      return res.json({
        message: 'data has been deleted',
        data: sickApplication,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Approve Sick Application
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

        const sickApplicationInputDTO = req.body;

        const sickApplication = await SickApplicationServiceInstance.approve(
          {
            ...sickApplicationInputDTO,
          },
          id,
        );

        return res.json({
          message: 'data has been approved',
          data: sickApplication,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Reject Sick Application
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

        const sickApplicationInputDTO = req.body;

        const sickApplication = await SickApplicationServiceInstance.reject(
          {
            ...sickApplicationInputDTO,
          },
          id,
        );

        return res.json({
          message: 'data has been rejected',
          data: sickApplication,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );
};
