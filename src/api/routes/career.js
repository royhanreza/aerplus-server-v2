const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const CareerService = require('../../services/career');
const DepartmentService = require('../../services/department');
const DesignationService = require('../../services/designation');
const JobTitleService = require('../../services/jobtitle');

dayjs.extend(utc);

const route = Router();
// const prisma = new PrismaClient();

const celebrateOptions = {
  abortEarly: false,
};

const CareerServiceInstance = CareerService;
const DepartmentServiceInstance = DepartmentService;
const DesignationServiceInstance = DesignationService;
const JobTitleServiceInstance = JobTitleService;

module.exports = (app) => {
  app.use('/careers', route);

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      const { careers } = await CareerServiceInstance.getAll();

      return res.json({
        message: 'OK',
        data: careers,
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
      const career = await CareerServiceInstance.getById(Number(id));

      return res.json({
        data: career,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Add new career data
   */
  route.post(
    '/',
    celebrate({
      [Segments.BODY]: Joi.object()
        .options(celebrateOptions)
        .keys({
          employee_id: Joi.number().required(),
          employment_status: Joi.string().required(),
          type: Joi.string().required(),
          // designation_id: Joi.number(),
          // department_id: Joi.number(),
          organization_id: Joi.number(),
          job_title_id: Joi.number(),
          job_level_id: Joi.number(),
          effective_date: Joi.string().required(),
          end_of_employment_date: Joi.string().allow('', null),
          tax_method: Joi.string().allow('', null),
          active: Joi.number(),
        }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const careerInputDTO = req.body;

        const career = await CareerServiceInstance.create({
          ...careerInputDTO,
        });

        return res.json({
          message: 'data has been saved successfully',
          data: career,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Update career data
   */
  route.post(
    '/:id',
    celebrate({
      [Segments.BODY]: Joi.object()
        .options(celebrateOptions)
        .keys({
          employee_id: Joi.number().required(),
          employment_status: Joi.string().required(),
          type: Joi.string().required(),
          // designation_id: Joi.number(),
          // department_id: Joi.number(),
          organization_id: Joi.number(),
          job_title_id: Joi.number(),
          job_level_id: Joi.number(),
          effective_date: Joi.string().required(),
          end_of_employment_date: Joi.string().allow('', null),
          tax_method: Joi.string().allow('', null),
          active: Joi.number(),
        }),
    }),
    // TODO: FIX MULTER AND JOI CONFIGURATION
    async (req, res, next) => {
      try {
        const { id } = req.params;

        const careerInputDTO = req.body;

        const career = await CareerServiceInstance.update(
          {
            ...careerInputDTO,
          },
          id,
        );

        return res.json({
          message: 'data has been saved successfully',
          data: career,
        });
      } catch (error) {
        next(error);
      }

      return null;
    },
  );

  /**
   * Delete career data
   */
  route.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const career = await CareerServiceInstance.delete(Number(id));

      return res.json({
        message: 'data has been deleted',
        data: career,
      });
    } catch (error) {
      next(error);
    }

    return null;
  });

  /**
   * Get resource for create and update career
   * cu = Create & Update
   */
  route.get('/resources/cu', async (req, res, next) => {
    try {
      const { departments } = await DepartmentServiceInstance.getAll();
      const { designations } = await DesignationServiceInstance.getAll();
      const { jobTitles } = await JobTitleServiceInstance.getAll();

      return res.json({
        data: {
          departments,
          designations,
          jobTitles,
        },
      });
    } catch (error) {
      next(error);
    }

    return null;
  });
};
