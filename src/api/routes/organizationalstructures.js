const { Router } = require('express');
// const { celebrate, Joi, Segments } = require('celebrate');
const dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc')
const utc = require('dayjs/plugin/utc');
const OrganizationService = require('../../services/organization');
const JobTitleService = require('../../services/jobtitle');
const JobLevelService = require('../../services/joblevel');

dayjs.extend(utc);

const route = Router();
// const prisma = new PrismaClient();

// const celebrateOptions = {
//   abortEarly: false,
// };

const OrganizationServiceInstance = OrganizationService;
const JobTitleServiceInstance = JobTitleService;
const JobLevelServiceInstance = JobLevelService;

module.exports = (app) => {
  app.use('/organizational-structures', route);

  /**
   * Get all employee data with pagination
   */
  route.get('/', async (req, res, next) => {
    try {
      const { organizations } = await OrganizationServiceInstance.getAll();
      const { jobTitles } = await JobTitleServiceInstance.getAll();
      const { jobLevels } = await JobLevelServiceInstance.getAll();

      return res.json({
        message: 'OK',
        data: {
          organizations,
          jobTitles,
          jobLevels,
        },
      });
      // * Get data with pagination
    } catch (error) {
      next(error);
    }

    return null;
  });
};
