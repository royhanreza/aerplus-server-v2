module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EmployeeCredentials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      employeeId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Employees',
          key: 'id',
        },
      },
      username: {
        type: Sequelize.STRING('255'),
        unique: true,
      },
      password: {
        type: Sequelize.STRING('255'),
      },
      mobileAccessType: {
        type: Sequelize.STRING,
      },
      isPhoneVerified: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
      },
      isEmailVerified: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
      },
      lastLogin: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('EmployeeCredentials');
  },
};
