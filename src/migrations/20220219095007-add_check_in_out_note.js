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
      await queryInterface.removeColumn('Attendances', 'note', {
        transaction,
      });

      await queryInterface.addColumn(
        'Attendances',
        'clockInNote',
        {
          type: Sequelize.STRING,
          after: 'clockInAttachment',
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'Attendances',
        'clockOutNote',
        {
          type: Sequelize.STRING,
          after: 'clockOutAttachment',
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
        'note',
        {
          type: Sequelize.STRING,
          after: 'approvalStatus',
        },
        { transaction },
      );

      await queryInterface.addColumn('Attendances', 'clockInNote', {
        transaction,
      });

      await queryInterface.addColumn('Attendances', 'clockOutNote', {
        transaction,
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
