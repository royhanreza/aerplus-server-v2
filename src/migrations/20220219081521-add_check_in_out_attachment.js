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
      await queryInterface.removeColumn('Attendances', 'attachment', {
        transaction,
      });

      await queryInterface.addColumn(
        'Attendances',
        'clockInAttachment',
        {
          type: Sequelize.STRING,
          after: 'clockInOfficeLongitude',
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'Attendances',
        'clockOutAttachment',
        {
          type: Sequelize.STRING,
          after: 'clockInOfficeLongitude',
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
        'attachment',
        {
          type: Sequelize.STRING,
          after: 'note',
        },
        { transaction },
      );

      await queryInterface.addColumn('Attendances', 'clockInAttachment', {
        transaction,
      });

      await queryInterface.addColumn('Attendances', 'clockOutAttachment', {
        transaction,
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
