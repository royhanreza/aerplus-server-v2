'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LeaveApprovalFlow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LeaveApprovalFlow.belongsTo(models.LeaveApplication, {
        foreignKey: 'leaveApplicationId',
        as: 'leaveApplication',
        onDelete: 'cascade',
      });
      LeaveApprovalFlow.belongsTo(models.Employee, {
        foreignKey: 'confirmedBy',
        as: 'confirmer',
        onDelete: 'cascade',
      });
    }
  }
  LeaveApprovalFlow.init(
    {
      leaveApplicationId: DataTypes.INTEGER,
      level: DataTypes.TINYINT,
      confirmedBy: DataTypes.INTEGER,
      confirmedAt: DataTypes.DATE,
      status: DataTypes.STRING,
      note: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'LeaveApprovalFlow',
    },
  );
  return LeaveApprovalFlow;
};
