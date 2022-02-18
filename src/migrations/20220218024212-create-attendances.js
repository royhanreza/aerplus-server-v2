// 'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Attendances', {
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
      date: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      clockIn: {
        allowNull: false,
        type: Sequelize.TIME,
      },
      clockInAt: {
        type: Sequelize.DATE,
      },
      clockInIpAddress: {
        type: Sequelize.STRING('20'),
      },
      clockInDeviceDetail: {
        type: Sequelize.STRING,
      },
      clockInLatitude: {
        type: Sequelize.STRING('30'),
      },
      clockInLongitude: {
        type: Sequelize.STRING('30'),
      },
      clockOut: {
        allowNull: false,
        type: Sequelize.TIME,
      },
      clockOutAt: {
        type: Sequelize.DATE,
      },
      clockOutIpAddress: {
        type: Sequelize.STRING('20'),
      },
      clockOutDeviceDetail: {
        type: Sequelize.STRING,
      },
      clockOutLatitude: {
        type: Sequelize.STRING('30'),
      },
      clockOutLongitude: {
        type: Sequelize.STRING('30'),
      },
      status: {
        type: Sequelize.STRING('30'),
      },
      timeLate: {
        type: Sequelize.SMALLINT,
      },
      earlyLeaving: {
        type: Sequelize.SMALLINT,
      },
      overtime: {
        type: Sequelize.SMALLINT,
      },
      approvalStatus: {
        allowNull: false,
        type: Sequelize.STRING('20'),
      },
      note: {
        type: Sequelize.STRING,
      },
      attachment: {
        type: Sequelize.STRING,
      },
      officeLatitude: {
        type: Sequelize.STRING('30'),
      },
      officeLongitude: {
        type: Sequelize.STRING('30'),
      },
      sickApplicationId: {
        type: Sequelize.INTEGER,
      },
      permissionApplicationId: {
        type: Sequelize.INTEGER,
      },
      leaveApplicationId: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Attendances');
  },
};
