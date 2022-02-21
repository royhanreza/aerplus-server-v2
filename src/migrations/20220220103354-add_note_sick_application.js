'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('SickApplications', 'note', {
      type: Sequelize.STRING,
      after: 'sickDates',
    });
    await queryInterface.addColumn('SickApplications', 'currentApprovalLevel', {
      type: Sequelize.TINYINT,
      defaultValue: 1,
      after: 'note',
    });
    await queryInterface.addColumn('SickApplications', 'approvalStatus', {
      type: Sequelize.STRING('30'),
      defaultValue: 'pending',
      after: 'currentApprovalLevel',
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('SickApplications', 'note');
    await queryInterface.removeColumn(
      'SickApplications',
      'currentApprovalLevel',
    );
    await queryInterface.removeColumn('SickApplications', 'approvalStatus');
  },
};
