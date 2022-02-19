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
      await queryInterface.changeColumn(
        'Attendances',
        'clockIn',
        {
          type: Sequelize.TIME,
          allowNull: true,
        },
        { transaction },
      );
      await queryInterface.changeColumn(
        'Attendances',
        'clockOut',
        {
          type: Sequelize.TIME,
          allowNull: true,
        },
        { transaction },
      );
      await queryInterface.changeColumn(
        'Attendances',
        'approvalStatus',
        {
          type: Sequelize.TIME,
          allowNull: true,
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
      await queryInterface.changeColumn(
        'Attendances',
        'clockIn',
        {
          type: Sequelize.TIME,
          allowNull: false,
        },
        { transaction },
      );
      await queryInterface.changeColumn(
        'Attendances',
        'clockOut',
        {
          type: Sequelize.TIME,
          allowNull: false,
        },
        { transaction },
      );
      await queryInterface.changeColumn(
        'Attendances',
        'approvalStatus',
        {
          type: Sequelize.TIME,
          allowNull: false,
        },
        { transaction },
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
