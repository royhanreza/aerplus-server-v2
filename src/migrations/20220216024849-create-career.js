/* eslint-disable lines-around-directive */
/* eslint-disable strict */
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Careers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      employeeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      employmentStatus: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      designationId: {
        type: Sequelize.INTEGER,
      },
      departmentId: {
        type: Sequelize.INTEGER,
      },
      jobTitleId: {
        type: Sequelize.INTEGER,
      },
      effectiveDate: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      endOfEmploymentDate: {
        type: Sequelize.DATEONLY,
      },
      taxMethod: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Careers');
  },
};
