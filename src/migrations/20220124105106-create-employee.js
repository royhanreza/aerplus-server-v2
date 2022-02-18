module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      employeeId: {
        type: Sequelize.STRING('30'),
        unique: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING('255'),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING('255'),
        allowNull: true,
        unique: true,
      },
      handphone: {
        type: Sequelize.STRING('255'),
        allowNull: true,
        unique: true,
      },
      placeOfBirth: {
        type: Sequelize.STRING('255'),
        allowNull: true,
      },
      birthDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING('10'),
        allowNull: false,
      },
      maritalStatus: {
        type: Sequelize.STRING('50'),
        allowNull: false,
      },
      bloodType: {
        type: Sequelize.STRING('10'),
        allowNull: true,
      },
      religion: {
        type: Sequelize.STRING('50'),
        allowNull: false,
      },
      identityType: {
        type: Sequelize.STRING('50'),
        allowNull: true,
      },
      identityNumber: {
        type: Sequelize.STRING('50'),
        allowNull: true,
      },
      identityExpiryDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      identityAddress: {
        type: Sequelize.STRING('255'),
        allowNull: true,
      },
      postalCode: {
        type: Sequelize.STRING('50'),
        allowNull: true,
      },
      residentialAddress: {
        type: Sequelize.STRING('255'),
        allowNull: true,
      },
      photo: {
        type: Sequelize.STRING('255'),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Employees');
  },
};
