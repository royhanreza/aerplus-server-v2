'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WorkingPatternItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      workingPatternId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      order: {
        type: Sequelize.TINYINT,
      },
      dayStatus: {
        type: Sequelize.STRING('30'),
      },
      clockIn: {
        type: Sequelize.TIME,
      },
      clockOut: {
        type: Sequelize.TIME,
      },
      delayTolerance: {
        type: Sequelize.SMALLINT,
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
    await queryInterface.dropTable('WorkingPatternItems');
  },
};
