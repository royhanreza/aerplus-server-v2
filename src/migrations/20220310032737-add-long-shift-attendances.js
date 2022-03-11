// 'use strict';

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
        'Attendances',
        'isLongShift',
        {
          type: Sequelize.BOOLEAN,
          after: 'approvalStatus',
          defaultValue: false,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'Attendances',
        'longShiftWorkingPatternClockInTime',
        {
          type: Sequelize.TIME,
          after: 'isLongShift',
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'Attendances',
        'longShiftWorkingPatternClockOutTime',
        {
          type: Sequelize.TIME,
          after: 'longShiftWorkingPatternClockInTime',
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
      await queryInterface.removeColumn('Attendances', 'isLongShift', {
        transaction,
      });
      await queryInterface.removeColumn(
        'Attendances',
        'longShiftWorkingPatternClockInTime',
        { transaction },
      );
      await queryInterface.removeColumn(
        'Attendances',
        'longShiftWorkingPatternClockOutTime',
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
