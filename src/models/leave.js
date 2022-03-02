'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Leave extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Leave.belongsTo(models.Employee, {
        foreignKey: 'employeeId',
        as: 'employee',
      });
    }
  }
  Leave.init(
    {
      employeeId: DataTypes.INTEGER,
      startDate: DataTypes.DATEONLY,
      endDate: DataTypes.DATEONLY,
      totalLeave: DataTypes.TINYINT,
      takenLeave: DataTypes.TINYINT,
      active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Leave',
    },
  );
  return Leave;
};
