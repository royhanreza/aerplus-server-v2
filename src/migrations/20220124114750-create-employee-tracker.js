module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EmployeeTrackers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      employeeId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Employees',
          key: 'id',
        },
      },
      isTracked: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('EmployeeTrackers');
  },
};
