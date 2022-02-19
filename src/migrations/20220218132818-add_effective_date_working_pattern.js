'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'EmployeeWorkingPatterns',
        'effectiveDate',
        {
          type: Sequelize.DATEONLY,
          after: 'workingPatternId',
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'EmployeeWorkingPatterns',
        'endDate',
        {
          type: Sequelize.DATEONLY,
          after: 'effectiveDate',
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'EmployeeWorkingPatterns',
        'daysTo',
        {
          type: Sequelize.SMALLINT,
          after: 'endDate',
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'EmployeeWorkingPatterns',
        'workInHoliday',
        {
          type: Sequelize.BOOLEAN,
          after: 'daysTo',
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'EmployeeWorkingPatterns',
        'workInMassLeave',
        {
          type: Sequelize.BOOLEAN,
          after: 'workInHoliday',
        },
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn(
        'EmployeeWorkingPatterns',
        'effectiveDate',
        {
          transaction,
        },
      );
      await queryInterface.removeColumn('EmployeeWorkingPatterns', 'endDate', {
        transaction,
      });
      await queryInterface.removeColumn('EmployeeWorkingPatterns', 'daysTo', {
        transaction,
      });
      await queryInterface.removeColumn(
        'EmployeeWorkingPatterns',
        'workInHoliday',
        {
          transaction,
        },
      );
      await queryInterface.removeColumn(
        'EmployeeWorkingPatterns',
        'workInMassLeave',
        {
          transaction,
        },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
