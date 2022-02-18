/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */

const bcryptjs = require('bcryptjs');
const models = require('../models');

const { EmployeeCredential, Employee } = models;

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
}

module.exports = InspectionService;
