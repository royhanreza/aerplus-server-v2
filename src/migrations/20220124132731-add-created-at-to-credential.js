module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'EmployeeCredentials',
      'createdAt',
      Sequelize.DATE,
    );
    await queryInterface.addColumn(
      'EmployeeCredentials',
      'updatedAt',
      Sequelize.DATE,
    );
  },

  async down(queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('EmployeeCredentials', 'createdAt');
    await queryInterface.removeColumn('EmployeeCredentials', 'updatedAt');
  },
};
