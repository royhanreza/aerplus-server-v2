// 'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EmployeeWorkingPatterns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      EmployeeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      WorkingPatternId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1,
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
    await queryInterface.dropTable('EmployeeWorkingPatterns');
  },
};
