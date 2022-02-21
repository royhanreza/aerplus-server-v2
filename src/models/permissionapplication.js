'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PermissionApplication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PermissionApplication.hasMany(models.PermissionApprovalFlow, {
        as: 'approvalFlows',
        onDelete: 'cascade',
      });
      PermissionApplication.hasMany(models.Attendance, {
        as: 'attendances',
        onDelete: 'cascade',
      });
    }
  }
  PermissionApplication.init(
    {
      employeeId: DataTypes.INTEGER,
      date: DataTypes.DATEONLY,
      permissionDates: DataTypes.STRING,
      note: DataTypes.STRING,
      currentApprovalLevel: DataTypes.TINYINT,
      approvalStatus: DataTypes.STRING,
      attachment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'PermissionApplication',
    },
  );
  return PermissionApplication;
};
