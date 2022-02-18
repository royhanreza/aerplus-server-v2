const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const multer = require('multer');
const InspectionService = require('../../services/inspection');
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

const InspectionServiceInstance = InspectionService;

module.exports = (app) => {
  app.use('/inspections', route);

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      const pagination = req.query.pagination || false;
      const orderBy = cleanQueryFilter(
        req.query.order_by,
        ['datetime'],
        'datetime',
      );
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
      // const { inspections } = await InspectionServiceInstance.getAll();

      // return res.json({
      //   data: filter,
      // });

      if (!pagination || pagination !== 'true') {
        const { inspections } = await InspectionServiceInstance.getAll(filter);

        return res.json({
          data: inspections,
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

      const { inspections, total } = await InspectionServiceInstance.paginate(
        Number(page),
        Number(perPage),
        filter,
      );

      return res.json({
        data: inspections,
        total,
        // filter,
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
      const inspection = await InspectionServiceInstance.getById(Number(id));

      return res.json({
        data: inspection,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Add new inspection data
   */
  route.post(
    '/',
    uploadManual.single('image'),
    celebrate({
      [Segments.BODY]: Joi.object().options(celebrateOptions).keys({
        employee_id: Joi.number().required(),
        datetime: Joi.date().required(),
        latitude: Joi.string().required(),
        longitude: Joi.string().required(),
        address: Joi.string().required(),
      }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const inspectionInputDTO = req.body;
        // return res.json({
        //   request: { ...inspectionInputDTO, file: req.file },
        // });

        // const requestFile = req.file as any;

        const inspection = await InspectionServiceInstance.create(
          {
            ...inspectionInputDTO,
          },
          req,
        );

        return res.json({
          message: 'data has been saved successfully',
          data: inspection,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Delete inspection data
   */
  route.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const inspection = await InspectionServiceInstance.delete(Number(id));

      return res.json({
        message: 'data has been deleted',
        data: inspection,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });
};
