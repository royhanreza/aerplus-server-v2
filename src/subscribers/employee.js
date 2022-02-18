const { firestore } = require('../loaders/firebase');
const Logger = require('../loaders/logger');
const events = require('./events');

class EmployeeSubscriber {
  static async onCreateEmployee({ id, name }) {
    try {
      Logger.info(
        `Saving employee to firestore on event ${events.employee.create}`,
      );
      await firestore.collection('employee_locations').doc(id.toString()).set({
        employee_id: id,
        name,
        photo: null,
        latitude: 0,
        longitude: 0,
        address: null,
        is_tracked: false,
      });
    } catch (e) {
      Logger.error(`🔥 Error on event ${events.employee.create}: %o`, e);

      // Throw the error so the process die (check src/app.ts)
      throw e;
    }
  }

  static async onUpdateEmployee({ id, employee }) {
    try {
      Logger.info(
        `Saving employee to firestore on event ${events.employee.update}`,
      );

      const employeeRef = firestore
        .collection('employee_locations')
        .doc(id.toString());

      await employeeRef.update({
        employee_id: id,
        name: employee.name,
        photo: null,
        // is_tracked: false,
      });
    } catch (e) {
      Logger.error(`🔥 Error on event ${events.employee.update}: %o`, e);

      // Throw the error so the process die (check src/app.ts)
      throw e;
    }
  }

  static async onUpdateIsTracked({ id, isTracked }) {
    try {
      Logger.info(
        `Saving employee to firestore on event ${events.employee.updateIsTracked} with employee id: ${id} and status: ${isTracked}`,
      );

      if (id) {
        const employeeRef = firestore
          .collection('employee_locations')
          .doc(id.toString());

        await employeeRef.update({
          // eslint-disable-next-line no-unneeded-ternary
          is_tracked: isTracked ? true : false,
        });
      }
    } catch (e) {
      Logger.error(
        `🔥 Error on event ${events.employee.updateIsTracked}: %o`,
        e,
      );

      // Throw the error so the process die (check src/app.ts)
      throw e;
    }
  }

  static async onUpdatePhoto({ id, photo }) {
    try {
      Logger.info(
        `Saving employee to firestore on event ${events.employee.updatePhoto} with employee id: ${id} and photo: ${photo}`,
      );

      if (id) {
        const employeeRef = firestore
          .collection('employee_locations')
          .doc(id.toString());

        await employeeRef.update({
          photo: photo || null,
        });
      }
    } catch (e) {
      Logger.error(`🔥 Error on event ${events.employee.updatePhoto}: %o`, e);

      // Throw the error so the process die (check src/app.ts)
      throw e;
    }
  }
}

module.exports = EmployeeSubscriber;
