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
      await queryInterface.removeColumn('Attendances', 'officeLatitude', {
        transaction,
      });
      await queryInterface.removeColumn('Attendances', 'officeLongitude', {
        transaction,
      });
      await queryInterface.addColumn(
        'Attendances',
        'clockInOfficeLatitude',
        {
          type: Sequelize.STRING('30'),
          after: 'clockInLongitude',
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'Attendances',
        'clockInOfficeLongitude',
        {
          type: Sequelize.STRING('30'),
          after: 'clockInOfficeLatitude',
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'Attendances',
        'clockOutOfficeLatitude',
        {
          type: Sequelize.STRING('30'),
          after: 'clockOutLongitude',
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'Attendances',
        'clockOutOfficeLongitude',
        {
          type: Sequelize.STRING('30'),
          after: 'clockOutOfficeLatitude',
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
      await queryInterface.addColumn(
        'Attendances',
        'officeLatitude',
        {
          type: Sequelize.STRING('30'),
          after: 'attachment',
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'Attendances',
        'officeLongitude',
        {
          type: Sequelize.STRING('30'),
          after: 'officeLatitude',
        },
        { transaction },
      );
      await queryInterface.removeColumn(
        'Attendances',
        'clockInOfficeLatitude',
        {
          transaction,
        },
      );
      await queryInterface.removeColumn(
        'Attendances',
        'clockInOfficeLongitude',
        { transaction },
      );
      await queryInterface.removeColumn(
        'Attendances',
        'clockOutOfficeLatitude',
        { transaction },
      );
      await queryInterface.removeColumn(
        'Attendances',
        'clockOutOfficeLongitude',
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
