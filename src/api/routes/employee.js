const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const multer = require('multer');
const EmployeeService = require('../../services/employee');
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

const employeeServiceInstance = EmployeeService;

module.exports = (app) => {
  app.use('/employees', route);

  /**
   * Get all employee data without pagination
   */
  //   route.get('/', async (req, res, next) => {
  //     try {
  //       const employees = await employeeServiceInstance.getAll();

  //       return res.json({
  //         data: employees,
  //       });
  //     } catch (error) {
  //       next(error);
  //     }

  //     return null;
  //   });

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      // eslint-disable-next-line camelcase
      const { page, per_page } = req.query;

      //   const employeeServiceInstance = Container.get(EmployeeService);
      //   const { employees, total } = await employeeServiceInstance.paginate(
      //     Number(page),
      //     Number(per_page),
      //   );
      //   const employees = await Employee.findAll();
      const { employees, total } = await employeeServiceInstance.paginate(
        page,
        per_page,
      );

      return res.json({
        data: employees,
        info: { page: Number(page), total },
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Get specific employee data by id
   */
  route.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const employee = await employeeServiceInstance.getById(Number(id));

      return res.json({
        data: employee,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Get specific inspection data by employee id with or without pagination
   */
  route.get('/:id/inspections', async (req, res, next) => {
    try {
      const { id } = req.params;
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

      // return res.send(filter);

      // * Get data without pagination
      if (!pagination || pagination !== 'true') {
        const { inspections } = await employeeServiceInstance.getInspections(
          Number(id),
          filter,
        );

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

      // eslint-disable-next-line operator-linebreak
      const { inspections, total } =
        await employeeServiceInstance.getPaginatedInspections(
          Number(id),
          Number(page),
          Number(perPage),
          filter,
        );

      return res.json({
        data: inspections,
        total,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Get specific attendances data by employee id with or without pagination
   */
  route.get('/:id/attendances', async (req, res, next) => {
    try {
      const { id } = req.params;
      const pagination = req.query.pagination || false;
      const orderBy = cleanQueryFilter(req.query.order_by, ['date'], 'date');
      const orderIn = cleanQueryFilter(
        req.query.order_in,
        ['desc', 'asc'],
        'desc',
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
        const { attendances } = await employeeServiceInstance.getAttendances(
          Number(id),
          filter,
        );

        return res.json({
          data: attendances,
        });
      }

      // * Get data with pagination

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
      const { attendances, total } =
        await employeeServiceInstance.getPaginatedAttendances(
          Number(id),
          Number(page),
          Number(perPage),
          filter,
        );

      return res.json({
        data: attendances,
        page: Number(page),
        total,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Get specific dick application data by employee id with or without pagination
   */
  route.get('/:id/sick-applications', async (req, res, next) => {
    try {
      const { id } = req.params;
      const pagination = req.query.pagination || false;
      const status = cleanQueryFilter(
        req.query.status,
        ['pending', 'approved', 'rejected'],
        null,
      );
      const orderBy = cleanQueryFilter(req.query.order_by, ['date'], 'date');
      const orderIn = cleanQueryFilter(
        req.query.order_in,
        ['desc', 'asc'],
        'desc',
      );
      const startDate = cleanQueryFilter(req.query.start_date, [], null);
      const endDate = cleanQueryFilter(req.query.end_date, [], null);

      const filter = {
        status,
        orderBy,
        orderIn,
        startDate: startDate && new Date(startDate),
        endDate: endDate && dayjs.utc(endDate).add(1, 'day').format(),
      };

      // return res.send(filter);

      // * Get data without pagination
      if (!pagination || pagination !== 'true') {
        const { sickApplications } =
          await employeeServiceInstance.getSickApplications(Number(id), filter);

        return res.json({
          data: sickApplications,
        });
      }

      // * Get data with pagination

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
        await employeeServiceInstance.getPaginatedSickApplications(
          Number(id),
          Number(page),
          Number(perPage),
          filter,
        );

      return res.json({
        data: sickApplications,
        page: Number(page),
        total,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Get working patterns by employee
   */
  route.get('/:id/working-patterns', async (req, res, next) => {
    try {
      const { id } = req.params;
      const workingPatterns = await employeeServiceInstance.getWorkingPatterns(
        Number(id),
      );

      return res.json({
        data: workingPatterns,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Get working patterns by employee
   */
  route.get('/:id/active-working-pattern', async (req, res, next) => {
    try {
      const { id } = req.params;
      // eslint-disable-next-line operator-linebreak
      const activeWorkingPattern =
        await employeeServiceInstance.getActiveWorkingPattern(Number(id));

      return res.json({
        data: activeWorkingPattern,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Add new employee data
   */
  route.post(
    '/',
    celebrate({
      [Segments.BODY]: Joi.object()
        .options(celebrateOptions)
        .keys({
          employee_id: Joi.string().required(),
          name: Joi.string().required(),
          email: Joi.string().email().required(),
          handphone: Joi.any(),
          phone: Joi.any(),
          place_of_birth: Joi.string().allow('', null),
          birth_date: Joi.date().required(),
          gender: Joi.string().valid('male', 'female').required(),
          marital_status: Joi.string().required(),
          blood_type: Joi.string().allow('', null),
          religion: Joi.string().required(),
          identity_type: Joi.string().allow('', null),
          identity_number: Joi.string().allow('', null),
          identity_expiry_date: Joi.date().allow('', null).default(null),
          identity_address: Joi.string().allow('', null),
          postal_code: Joi.string().allow('', null),
          residential_address: Joi.string().allow('', null),
          username: Joi.string().allow('', null),
          password: Joi.string().allow('', null),
          mobile_access_type: Joi.string().allow('', null),
        }),
    }),
    async (req, res, next) => {
      try {
        const employeeInputDTO = req.body;

        const { employee } = await employeeServiceInstance.create(
          employeeInputDTO,
        );

        return res.json({
          message: 'data has been saved successfully',
          data: employee,
        });
      } catch (error) {
        next(error);
      }
      return null;
    },
  );

  /**
   * Update employee data
   */
  route.post(
    '/:id',
    celebrate({
      [Segments.BODY]: Joi.object()
        .options(celebrateOptions)
        .keys({
          employee_id: Joi.string().required(),
          name: Joi.string().required(),
          email: Joi.string().email().required(),
          handphone: Joi.any(),
          phone: Joi.any(),
          place_of_birth: Joi.string().allow('', null),
          birth_date: Joi.date().required(),
          gender: Joi.string().valid('male', 'female').required(),
          marital_status: Joi.string().required(),
          blood_type: Joi.string().allow('', null),
          religion: Joi.string().required(),
          identity_type: Joi.string().allow('', null),
          identity_number: Joi.string().allow('', null),
          identity_expiry_date: Joi.date().allow('', null).default(null),
          identity_address: Joi.string().allow('', null),
          postal_code: Joi.string().allow('', null),
          residential_address: Joi.string().allow('', null),
        }),
    }),
    async (req, res, next) => {
      try {
        const { id } = req.params;

        const employeeInputDTO = req.body;

        const employee = await employeeServiceInstance.update(
          Number(id),
          employeeInputDTO,
        );

        return res.json({
          message: 'data has been updated',
          data: employee,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Update tracker status
   */
  route.post(
    '/:id/update-is-tracked',
    celebrate({
      [Segments.BODY]: Joi.object().options(celebrateOptions).keys({
        is_tracked: Joi.number().required(),
      }),
    }),
    async (req, res, next) => {
      try {
        const { id } = req.params;

        const { is_tracked } = req.body;

        const employee = await employeeServiceInstance.updateIsTracked(
          Number(id),
          is_tracked,
        );

        return res.json({
          message: 'data has been updated',
          data: employee,
          // request: {
          //   emplyeeId: id,
          //   isTracked: is_tracked,
          // },
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Update photo
   */
  route.post(
    '/:id/update-photo',
    uploadManual.single('photo'),
    async (req, res, next) => {
      try {
        if (req.file) {
          const { id } = req.params;

          const { employee, data } = await employeeServiceInstance.updatePhoto(
            Number(id),
            req,
          );

          return res.json({
            message: 'data has been updated',
            data: employee,
            image: data,
          });
        }

        return res.json({
          message: 'data has been updated',
          employee: null,
        });
      } catch (error) {
        next(error);
      }
      return null;
    },
  );

  /**
   * Delete employee data
   */
  route.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const employee = await employeeServiceInstance.delete(Number(id));

      return res.json({
        message: 'data has been deleted',
        data: employee,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });
};
