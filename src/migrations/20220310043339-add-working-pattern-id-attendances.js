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
        'workingPatternId',
        {
          // allowNull: false,
          type: Sequelize.INTEGER,
          after: 'longShiftWorkingPatternClockOutTime',
          references: {
            model: 'WorkingPatterns',
            key: 'id',
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'Attendances',
        'longShiftWorkingPatternId',
        {
          type: Sequelize.INTEGER,
          after: 'isLongShift',
          references: {
            model: 'WorkingPatterns',
            key: 'id',
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
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
      await queryInterface.removeColumn('Attendances', 'workingPatternId', {
        transaction,
      });
      await queryInterface.removeColumn(
        'Attendances',
        'longShiftWorkingPatternId',
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
