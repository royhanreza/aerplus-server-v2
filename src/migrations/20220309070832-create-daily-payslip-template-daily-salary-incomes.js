'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DailyPayslipTemplateDailySalaryIncomes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      DailyPayslipTemplateId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'DailyPayslipTemplates',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      DailySalaryIncomeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'DailySalaryIncomes',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      amount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    await queryInterface.dropTable('DailyPayslipTemplateDailySalaryIncomes');
  },
};
