'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Careers', 'organizationId', {
      type: Sequelize.INTEGER,
      after: 'departmentId',
      references: {
        model: 'Organizations',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addColumn('Careers', 'jobLevelId', {
      type: Sequelize.INTEGER,
      after: 'jobTitleId',
      references: {
        model: 'JobLevels',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    await queryInterface.removeColumn('Careers', 'departmentId');
    await queryInterface.removeColumn('Careers', 'designationId');
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Careers', 'organizationId');
    await queryInterface.removeColumn('Careers', 'jobLevelId');
    await queryInterface.addColumn('Careers', 'designationId', {
      type: Sequelize.INTEGER,
      after: 'type',
    });
    await queryInterface.addColumn('Careers', 'departmentId', {
      type: Sequelize.INTEGER,
      after: 'designationId',
    });
  },
};
