// 'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.belongsTo(models.SickApplication, {
        foreignKey: 'sickApplicationId',
        as: 'sickApplication',
        onDelete: 'cascade',
      });
      Attendance.belongsTo(models.Employee, {
        foreignKey: 'employeeId',
        as: 'employee',
        onDelete: 'cascade',
      });
    }
  }
  Attendance.init(
    {
      employeeId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      date: {
        allowNull: false,
        type: DataTypes.DATEONLY,
      },
      clockIn: {
        // allowNull: false,
        type: DataTypes.TIME,
      },
      clockInAt: {
        type: DataTypes.DATE,
      },
      clockInIpAddress: {
        type: DataTypes.STRING('20'),
      },
      clockInDeviceDetail: {
        type: DataTypes.STRING,
      },
      clockInLatitude: {
        type: DataTypes.STRING('30'),
      },
      clockInLongitude: {
        type: DataTypes.STRING('30'),
      },
      clockInOfficeLatitude: {
        type: DataTypes.STRING('30'),
      },
      clockInOfficeLongitude: {
        type: DataTypes.STRING('30'),
      },
      clockInWorkingPatternTime: {
        type: DataTypes.TIME,
      },
      clockInAttachment: {
        type: DataTypes.STRING,
      },
      clockInNote: {
        type: DataTypes.STRING,
      },
      clockOut: {
        // allowNull: false,
        type: DataTypes.TIME,
      },
      clockOutAt: {
        type: DataTypes.DATE,
      },
      clockOutIpAddress: {
        type: DataTypes.STRING('20'),
      },
      clockOutDeviceDetail: {
        type: DataTypes.STRING,
      },
      clockOutLatitude: {
        type: DataTypes.STRING('30'),
      },
      clockOutLongitude: {
        type: DataTypes.STRING('30'),
      },
      clockOutOfficeLatitude: {
        type: DataTypes.STRING('30'),
      },
      clockOutOfficeLongitude: {
        type: DataTypes.STRING('30'),
      },
      clockOutWorkingPatternTime: {
        type: DataTypes.TIME,
      },
      clockOutAttachment: {
        type: DataTypes.STRING,
      },
      clockOutNote: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING('30'),
      },
      timeLate: {
        type: DataTypes.SMALLINT,
      },
      earlyLeaving: {
        type: DataTypes.SMALLINT,
      },
      overtime: {
        type: DataTypes.SMALLINT,
      },
      approvalStatus: {
        // allowNull: false,
        type: DataTypes.STRING('20'),
      },
      isLongShift: {
        type: DataTypes.BOOLEAN,
      },
      longShiftWorkingPatternId: {
        type: DataTypes.INTEGER,
      },
      longShiftWorkingPatternClockInTime: {
        type: DataTypes.TIME,
      },
      longShiftWorkingPatternClockOutTime: {
        type: DataTypes.TIME,
      },
      // note: {
      //   type: DataTypes.STRING,
      // },
      // attachment: {
      //   type: DataTypes.STRING,
      // },
      // officeLatitude: {
      //   type: DataTypes.STRING('30'),
      // },
      // officeLongitude: {
      //   type: DataTypes.STRING('30'),
      // },
      workingPatternId: {
        type: DataTypes.INTEGER,
      },
      sickApplicationId: {
        type: DataTypes.INTEGER,
      },
      permissionApplicationId: {
        type: DataTypes.INTEGER,
      },
      leaveApplicationId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'Attendance',
    },
  );
  return Attendance;
};
