'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn(
      'PermissionApplications',
      'currentApprovalLevel',
      {
        type: Sequelize.TINYINT,
        defaultValue: 1,
      },
    );

    await queryInterface.changeColumn(
      'PermissionApplications',
      'approvalStatus',
      {
        type: Sequelize.STRING,
        defaultValue: 'pending',
      },
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(
      'PermissionApplications',
      'currentApprovalLevel',
    );
    await queryInterface.removeColumn(
      'PermissionApplications',
      'approvalStatus',
    );
  },
};
