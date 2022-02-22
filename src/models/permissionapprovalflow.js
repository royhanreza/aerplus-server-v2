'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PermissionApprovalFlow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PermissionApprovalFlow.belongsTo(models.PermissionApplication, {
        foreignKey: 'permissionApplicationId',
        as: 'permissionApplication',
        onDelete: 'cascade',
      });
      PermissionApprovalFlow.belongsTo(models.Employee, {
        foreignKey: 'confirmedBy',
        as: 'confirmer',
        onDelete: 'cascade',
      });
    }
  }
  PermissionApprovalFlow.init(
    {
      permissionApplicationId: DataTypes.INTEGER,
      level: DataTypes.TINYINT,
      confirmedBy: DataTypes.INTEGER,
      confirmedAt: DataTypes.DATE,
      status: DataTypes.STRING,
      note: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'PermissionApprovalFlow',
    },
  );
  return PermissionApprovalFlow;
};
