'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LeaveApplication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LeaveApplication.hasMany(models.LeaveApprovalFlow, {
        as: 'approvalFlows',
        onDelete: 'cascade',
      });
      LeaveApplication.hasMany(models.Attendance, {
        as: 'attendances',
        onDelete: 'cascade',
      });
    }
  }
  LeaveApplication.init(
    {
      employeeId: DataTypes.INTEGER,
      date: DataTypes.DATEONLY,
      leaveDates: DataTypes.STRING,
      note: DataTypes.STRING,
      currentApprovalLevel: DataTypes.TINYINT,
      approvalStatus: DataTypes.STRING,
      attachment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'LeaveApplication',
    },
  );
  return LeaveApplication;
};
