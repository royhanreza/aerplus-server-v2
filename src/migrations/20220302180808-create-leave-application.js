'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LeaveApplications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      employeeId: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: 'Employees',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      date: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      leaveDates: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      note: {
        type: Sequelize.STRING,
      },
      currentApprovalLevel: {
        type: Sequelize.TINYINT,
        defaultValue: 1,
      },
      approvalStatus: {
        type: Sequelize.STRING,
        defaultValue: 'pending',
      },
      attachment: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('LeaveApplications');
  },
};
