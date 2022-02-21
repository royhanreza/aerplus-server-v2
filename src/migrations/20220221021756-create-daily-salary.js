'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DailySalaries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      employeeId: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: 'Employees', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING,
      },
      startDatePeriod: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      endDatePeriod: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      incomes: {
        type: Sequelize.TEXT,
      },
      deductions: {
        type: Sequelize.TEXT,
      },
      note: {
        type: Sequelize.STRING,
      },
      noteBy: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: 'Employees', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DailySalaries');
  },
};
