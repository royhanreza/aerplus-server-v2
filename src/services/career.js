/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */
const sequelize = require('../loaders/sequelize');
const models = require('../models');

const { Career } = models;

class CareerService {
  static async getAll() {
    try {
      const careers = await Career.findAll();
      return { careers };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const career = await Career.findByPk(id);
      return career;
    } catch (error) {
      throw error;
    }
  }

  static async create(careerInputDTO) {
    // eslint-disable-next-line object-curly-newline
    const {
      employee_id,
      employment_status,
      type,
      // designation_id,
      // department_id,
      organization_id,
      job_title_id,
      job_level_id,
      effective_date,
      end_of_employment_date,
      tax_method,
      active,
    } = careerInputDTO;

    const t = await sequelize.transaction();

    try {
      await Career.update(
        { active: 0 },
        {
          where: {
            active: 1,
            employeeId: employee_id,
          },
          transaction: t,
        },
      );

      const career = await Career.create(
        {
          employeeId: employee_id,
          employmentStatus: employment_status,
          type,
          // designationId: designation_id,
          // departmentId: department_id,
          organizationId: organization_id,
          jobTitleId: job_title_id,
          jobLevelId: job_level_id,
          effectiveDate: effective_date,
          endOfEmploymentDate: end_of_employment_date,
          taxMethod: tax_method,
          active,
        },
        { transaction: t },
      );

      await t.commit();

      return career;
    } catch (e) {
      await t.rollback();
      throw e.message || e;
    }
  }

  static async update(careerInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const {
      employee_id,
      employment_status,
      type,
      // designation_id,
      // department_id,
      organization_id,
      job_title_id,
      job_level_id,
      effective_date,
      end_of_employment_date,
      tax_method,
      active,
    } = careerInputDTO;

    const data = {
      employeeId: employee_id,
      employmentStatus: employment_status,
      type,
      // designationId: designation_id,
      // departmentId: department_id,
      organizationId: organization_id,
      jobTitleId: job_title_id,
      jobLevelId: job_level_id,
      effectiveDate: effective_date,
      endOfEmploymentDate: end_of_employment_date,
      taxMethod: tax_method,
      active,
    };

    try {
      await Career.update(data, {
        where: { id: Number(id) },
      });

      const career = await Career.findByPk(Number(id));

      return career;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async delete(id) {
    try {
      await Career.destroy({
        where: { id: Number(id) },
      });

      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CareerService;
