// 'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SickApplication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SickApplication.hasMany(models.SickApprovalFlow, {
        as: 'approvalFlows',
        onDelete: 'cascade',
      });
      SickApplication.hasMany(models.Attendance, {
        as: 'attendances',
        onDelete: 'cascade',
      });
    }
  }
  SickApplication.init(
    {
      employeeId: DataTypes.INTEGER.UNSIGNED,
      date: DataTypes.DATEONLY,
      sickDates: DataTypes.STRING,
      attachment: DataTypes.STRING,
      note: DataTypes.STRING,
      approvalStatus: DataTypes.STRING,
      currentApprovalLevel: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'SickApplication',
    },
  );
  return SickApplication;
};
