'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        'SickApprovalFlows',
        'sickapprovalflows_ibfk_1',
        { transaction },
      );
      await queryInterface.addConstraint('SickApprovalFlows', {
        fields: ['sickApplicationId'],
        type: 'foreign key',
        name: 'sickapprovalflows_ibfk_2',
        references: {
          table: 'SickApplications',
          field: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        transaction,
      });
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        'SickApprovalFlows',
        'sickapprovalflows_ibfk_2',
        { transaction },
      );
      await queryInterface.addConstraint('SickApprovalFlows', {
        fields: ['sickApplicationId'],
        type: 'foreign key',
        name: 'sickapprovalflows_ibfk_1',
        references: {
          table: 'SickApplications',
          field: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        transaction,
      });
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
