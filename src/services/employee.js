/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const bcryptjs = require('bcryptjs');
const sharp = require('sharp');
const models = require('../models');
const subscriber = require('../subscribers/employee');
const sequelize = require('../loaders/sequelize');
const config = require('../config');
const s3 = require('../loaders/awsS3');

// eslint-disable-next-line object-curly-newline
const {
  Employee,
  EmployeeCredential,
  EmployeeTracker,
  Inspection,
  WorkingPattern,
  Attendance,
  Career,
} = models;
class EmployeeService {
  static async getAll() {
    try {
      //   const employees = await prisma.employee.findMany();
      const employees = await Employee.findAll();
      return employees;
    } catch (error) {
      throw error.message || error;
    }
  }

  static async paginate(page, perPage) {
    try {
      const newPage = page || 1;
      const newPerPage = perPage || 10;
      const offset = (newPage - 1) * newPerPage;

      //   const employees = await prisma.employee.findMany({
      //     skip,
      //     take: perPage,
      //   });
      const { rows, count } = await Employee.findAndCountAll({
        limit: Number(newPerPage),
        offset: Number(offset),
      });

      //   const totalResults = await prisma.employee.count();
      return {
        employees: rows,
        total: count,
      };
    } catch (error) {
      throw error.message || error;
    }
  }

  static async getById(id) {
    try {
      //   const employees = await prisma.employee.findMany();
      const employee = await Employee.findByPk(id, {
        include: [
          'credential',
          'tracker',
          'office',
          // {
          //   model: WorkingPattern,
          //   as: 'workingPatterns',
          //   through: { where: { active: true } },
          // },
          {
            model: Career,
            as: 'careers',
            include: ['designation', 'department', 'jobTitle'],
          },
        ],
      });

      const newEmployee = employee.get();

      const activeCareer = employee.careers.filter(
        (career) => career.active,
      )[0];

      // if (activeCareer) {
      // newEmployee.activeCareer = activeCareer;
      // }
      Object.assign(newEmployee, { career: activeCareer });
      delete newEmployee.careers;

      return newEmployee;
    } catch (error) {
      throw error.message || error;
    }
  }

  static async getInspections(id, filter) {
    try {
      const inspections = await Inspection.findAll({
        order: [[filter.orderBy, filter.orderIn]],
        where: {
          employeeId: id,
          ...(filter.startDate &&
            filter.endDate && {
              datetime: {
                [Op.between]: [filter.startDate, filter.endDate],
              },
            }),
        },
      });

      return { inspections };
    } catch (error) {
      throw error;
    }
  }

  static async getPaginatedInspections(id, page, perPage, filter) {
    try {
      const offset = (page - 1) * perPage;

      const { rows, count } = await Inspection.findAndCountAll({
        order: [[filter.orderBy, filter.orderIn]],
        where: {
          employeeId: id,
          ...(filter.startDate &&
            filter.endDate && {
              datetime: {
                [Op.between]: [filter.startDate, filter.endDate],
              },
            }),
        },
        limit: Number(perPage),
        offset: Number(offset),
        include: 'employee',
      });

      return {
        inspections: rows,
        total: count,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getAttendances(id, filter) {
    try {
      const attendances = await Attendance.findAll({
        order: [[filter.orderBy, filter.orderIn]],
        where: {
          employeeId: id,
          ...(filter.startDate &&
            filter.endDate && {
              date: {
                [Op.between]: [filter.startDate, filter.endDate],
              },
            }),
        },
      });

      return { attendances };
    } catch (error) {
      throw error;
    }
  }

  static async getPaginatedAttendances(id, page, perPage, filter) {
    try {
      const offset = (page - 1) * perPage;

      const { rows, count } = await Attendance.findAndCountAll({
        order: [[filter.orderBy, filter.orderIn]],
        where: {
          employeeId: id,
          ...(filter.startDate &&
            filter.endDate && {
              date: {
                [Op.between]: [filter.startDate, filter.endDate],
              },
            }),
        },
        limit: Number(perPage),
        offset: Number(offset),
        // include: 'employee',
      });

      return {
        attendances: rows,
        page,
        total: count,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getWorkingPatterns(id) {
    try {
      // const workingPatterns = await WorkingPattern.findAll({
      //   where: {
      //     employeeId: id,
      //     '$employee.employeeId$': id,
      //   },
      // });
      const employee = await Employee.findByPk(id, {
        include: ['workingPatterns'],
      });

      const { workingPatterns } = employee;

      return workingPatterns;
    } catch (error) {
      throw error;
    }
  }

  static async getActiveWorkingPattern(id) {
    try {
      // const workingPatterns = await WorkingPattern.findAll({
      //   where: {
      //     employeeId: id,
      //     '$employee.employeeId$': id,
      //   },
      // });

      const employee = await Employee.findByPk(id, {
        include: [
          {
            model: WorkingPattern,
            as: 'workingPatterns',
            through: { where: { active: true }, order: [['id', 'ASC']] },
          },
        ],
      });

      let activeWorkingPattern = null;

      const { workingPatterns } = employee;

      if (Array.isArray(workingPatterns)) {
        if (workingPatterns.length > 0) {
          [activeWorkingPattern] = workingPatterns;
        }
      }

      return activeWorkingPattern;
    } catch (error) {
      throw error;
    }
  }

  static async create(employeeInputDTO) {
    try {
      const {
        employee_id,
        name,
        email,
        phone,
        handphone,
        place_of_birth,
        birth_date,
        gender,
        marital_status,
        blood_type,
        religion,
        identity_type,
        identity_number,
        identity_expiry_date,
        identity_address,
        postal_code,
        residential_address,
        username,
        password,
        mobile_access_type,
      } = employeeInputDTO;

      // Checking existing employee ID
      const employeeWithEmployeeId = await Employee.findOne({
        where: {
          employeeId: employee_id,
        },
      });

      if (employeeWithEmployeeId) {
        throw new Error('ID Pegawai sudah digunakan');
      }

      // Checking existing email
      const employeeWithEmail = await Employee.findOne({
        where: { email },
      });

      if (employeeWithEmail) {
        throw new Error(
          `Email sudah digunakan oleh ${employeeWithEmail.employeeId} - ${employeeWithEmail.name}`,
        );
      }

      // Checking existing handphone number
      const employeeWithHandphone = await Employee.findOne({
        where: { handphone },
      });

      if (employeeWithHandphone) {
        throw new Error(
          `Nomor handphone sudah digunakan oleh ${employeeWithHandphone.employeeId} - ${employeeWithHandphone.name}`,
        );
      }

      // Checking existing phone/telephone number
      // const employeeWithPhone = await Employee.findOne({
      //   where: { phone },
      // });

      // if (employeeWithPhone) {
      //   throw new Error(
      // eslint-disable-next-line max-len
      //     `Nomor telepon sudah digunakan oleh ${employeeWithPhone.employeeId} - ${employeeWithPhone.name}`,
      //   );
      // }
      let hashedPassword = null;

      if (password) {
        const salt = await bcryptjs.genSalt(10);
        hashedPassword = await bcryptjs.hash(password, salt);
      }

      const newEmployee = await sequelize.transaction(async (t) => {
        const employee = await Employee.create(
          {
            employeeId: employee_id.toString(),
            name: name.toString(),
            email: email.toString(),
            phone: phone.toString(),
            handphone: handphone.toString(),
            placeOfBirth: place_of_birth.toString(),
            birthDate: birth_date,
            gender: gender.toString(),
            maritalStatus: marital_status.toString(),
            bloodType: blood_type.toString(),
            religion: religion.toString(),
            identityType: identity_type.toString(),
            identityNumber: identity_number.toString(),
            identityExpiryDate: identity_expiry_date,
            identityAddress: identity_address.toString(),
            postalCode: postal_code.toString(),
            residentialAddress: residential_address.toString(),
          },
          { transaction: t },
        );

        await EmployeeCredential.create(
          {
            employeeId: employee.id,
            username,
            password: hashedPassword,
            mobileAccessType: mobile_access_type,
          },
          { transaction: t },
        );

        await EmployeeTracker.create(
          {
            employeeId: employee.id,
          },
          { transaction: t },
        );

        return employee;
      });

      /**
       * Subscriber on create employee
       */
      // this.eventDispatcher.dispatch(events.employee.create, employee);
      await subscriber.onCreateEmployee({ id: newEmployee.id, name });

      // return {
      //   employee,
      // };
      return newEmployee;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async update(id, employeeInputDTO) {
    const {
      employee_id,
      name,
      email,
      phone,
      handphone,
      place_of_birth,
      birth_date,
      gender,
      marital_status,
      blood_type,
      religion,
      identity_type,
      identity_number,
      identity_expiry_date,
      identity_address,
      postal_code,
      residential_address,
    } = employeeInputDTO;

    // Checking existing employee ID
    const employeeWithEmployeeId = await Employee.findOne({
      where: {
        employeeId: employee_id,
        [Op.not]: [
          {
            id: [Number(id)],
          },
        ],
      },
    });

    if (employeeWithEmployeeId) {
      throw new Error('ID Pegawai sudah digunakan');
    }

    // Checking existing email
    const employeeWithEmail = await Employee.findOne({
      where: {
        email,
        [Op.not]: [
          {
            id: [Number(id)],
          },
        ],
      },
    });

    if (employeeWithEmail) {
      throw new Error(
        `Email sudah digunakan oleh ${employeeWithEmail[0].employeeId} - ${employeeWithEmail[0].name}`,
      );
    }

    // Checking existing handphone number
    const employeeWithHandphone = await Employee.findOne({
      where: {
        handphone,
        [Op.not]: [
          {
            id: [Number(id)],
          },
        ],
      },
    });

    if (employeeWithHandphone) {
      throw new Error(
        `Nomor handphone sudah digunakan oleh ${employeeWithHandphone[0].employeeId} - ${employeeWithHandphone[0].name}`,
      );
    }

    // Checking existing phone/telephone number
    // const employeeWithPhone = await Employee.findOne({
    //   where: {
    //     phone,
    //     [Op.not]: [
    //       {
    //         id: [Number(id)],
    //       },
    //     ],
    //   },
    // });

    // if (employeeWithPhone) {
    //   throw new Error(
    // eslint-disable-next-line max-len
    //     `Nomor telepon sudah digunakan oleh ${employeeWithPhone[0].employeeId} - ${employeeWithPhone[0].name}`,
    //   );
    // }

    await Employee.update(
      {
        employeeId: employee_id.toString(),
        name: name.toString(),
        email: email.toString(),
        phone: phone.toString(),
        handphone: handphone.toString(),
        placeOfBirth: place_of_birth.toString(),
        birthDate: birth_date,
        gender: gender.toString(),
        maritalStatus: marital_status.toString(),
        bloodType: blood_type.toString(),
        religion: religion.toString(),
        identityType: identity_type.toString(),
        identityNumber: identity_number.toString(),
        identityExpiryDate: identity_expiry_date,
        identityAddress: identity_address.toString(),
        postalCode: postal_code.toString(),
        residentialAddress: residential_address.toString(),
      },
      {
        where: { id: Number(id) },
      },
    );

    const employee = await Employee.findByPk(Number(id));

    /**
     * Subscriber on create employee
     */
    await subscriber.onUpdateEmployee({ id: employee.id, employee });

    return employee;
  }

  static async updateIsTracked(employeeId, isTracked) {
    await Employee.update(
      {
        isTracked,
      },
      {
        where: { employeeId: Number(employeeId) },
      },
    );

    /**
     * Subscriber on update is_tracked employee
     */
    // this.eventDispatcher.dispatch(events.employee.updateIsTracked, {
    //   id: employeeId,
    //   isTracked,
    // });
    await subscriber.onUpdateIsTracked({ id: employeeId, isTracked });

    const employee = await Employee.findOne({
      where: {
        id: employeeId,
      },
    });

    return employee;
  }

  static awsS3upload(params) {
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }

  static async updatePhoto(id, req) {
    const sharpOptions = { failOnError: false };

    const compressedImage = await sharp(req.file.buffer, sharpOptions)
      .metadata()
      .then(
        ({ width }) =>
          // eslint-disable-next-line implicit-arrow-linebreak
          sharp(req.file.buffer, sharpOptions)
            .resize(Math.round(width * 0.5))
            .jpeg()
            .toBuffer(),
        // eslint-disable-next-line function-paren-newline
      );
    const params = {
      ACL: 'public-read',
      Bucket: config.aws.s3.bucket,
      Body: compressedImage,
      ContentType: 'image/jpeg',
      Key: `employees/photos/${Date.now().toString()}.jpg`,
    };

    const data = await this.awsS3upload(params);

    await Employee.update(
      {
        photo: data.key,
      },
      {
        where: {
          id,
        },
      },
    );

    const employee = Employee.findByPk(id);

    /**
     * Subscriber on update photo employee
     */
    // this.eventDispatcher.dispatch(events.employee.updatePhoto, {
    //   id,
    //   image: data.key,
    // });
    await subscriber.onUpdatePhoto({ id, photo: data.key });

    return { employee, data };
  }

  static async delete(id) {
    try {
      await Employee.destroy({
        where: { id: Number(id) },
      });

      return null;
    } catch (error) {
      throw error.message || error;
    }
  }
}

module.exports = EmployeeService;
