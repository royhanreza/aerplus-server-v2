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
        'clockInWorkingPatternTime',
        {
          type: Sequelize.TIME,
          after: 'clockInOfficeLongitude',
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'Attendances',
        'clockOutWorkingPatternTime',
        {
          type: Sequelize.TIME,
          after: 'clockOutOfficeLongitude',
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
        'Attendances',
        'clockInWorkingPatternTime',
        { transaction },
      );
      await queryInterface.removeColumn(
        'Attendances',
        'clockOutWorkingPatternTime',
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
