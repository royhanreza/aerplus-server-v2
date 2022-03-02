/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */

const bcryptjs = require('bcryptjs');
const models = require('../models');

const { EmployeeCredential, Employee, Career } = models;

class InspectionService {
  static async SignIn(username, password) {
    try {
      //   const { username, password } = authEmployeeInputDTO;

      const credential = await EmployeeCredential.findOne({
        where: {
          username,
        },
      });

      if (!credential) {
        // throw new Error("Cant find credential with username " + username);
        throw new Error('Invalid username or password');
      }

      //   if (!employeeRecord.credential) {
      //     throw new Error('Employee does not have credential');
      //   }

      const validPassword = await bcryptjs.compare(
        password,
        credential.password,
      );

      if (validPassword) {
        const employee = await Employee.findByPk(credential.employeeId);

        return {
          employee,
        };
      }

      throw new Error('Invalid username or password');

      /**
       * Subscriber on create inspection
       */
      //   this.eventDispatcher.dispatch(events.ins.create, employee);
    } catch (e) {
      throw e;
    }
  }

  static async mobileRegularSignIn(username, password) {
    try {
      //   const { username, password } = authEmployeeInputDTO;

      const credential = await EmployeeCredential.findOne({
        where: {
          username,
        },
      });

      if (!credential) {
        // throw new Error("Cant find credential with username " + username);
        throw new Error('Invalid username or password');
      }

      //   if (!employeeRecord.credential) {
      //     throw new Error('Employee does not have credential');
      //   }

      const validPassword = await bcryptjs.compare(
        password,
        credential.password,
      );

      if (validPassword) {
        const employee = await Employee.findByPk(credential.employeeId, {
          include: [
            {
              model: Career,
              as: 'careers',
              include: ['organization', 'jobTitle', 'jobLevel'],
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

        return {
          employee: newEmployee,
        };
      }

      throw new Error('Invalid username or password');

      /**
       * Subscriber on create inspection
       */
      //   this.eventDispatcher.dispatch(events.ins.create, employee);
    } catch (e) {
      throw e;
    }
  }

  static async mobileAdminSignIn(username, password) {
    try {
      //   const { username, password } = authEmployeeInputDTO;

      const credential = await EmployeeCredential.findOne({
        where: {
          username,
        },
      });

      if (!credential) {
        // throw new Error("Cant find credential with username " + username);
        throw new Error('Invalid username or password');
      }

      if (credential.mobileAccessType !== 'admin') {
        throw new Error('Employee does not have access to admin app');
      }

      const validPassword = await bcryptjs.compare(
        password,
        credential.password,
      );

      if (validPassword) {
        const employee = await Employee.findByPk(credential.employeeId, {
          include: [
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

        return {
          employee: newEmployee,
        };
      }

      throw new Error('Invalid username or password');

      /**
       * Subscriber on create inspection
       */
      //   this.eventDispatcher.dispatch(events.ins.create, employee);
    } catch (e) {
      throw e;
    }
  }
}

module.exports = InspectionService;
