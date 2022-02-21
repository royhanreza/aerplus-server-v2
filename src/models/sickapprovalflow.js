'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SickApprovalFlow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SickApprovalFlow.belongsTo(models.SickApplication, {
        foreignKey: 'sickApplicationId',
        as: 'sickApplication',
        onDelete: 'cascade',
      });
    }
  }
  SickApprovalFlow.init(
    {
      sickApplicationId: DataTypes.INTEGER.UNSIGNED,
      level: DataTypes.TINYINT,
      confirmedBy: DataTypes.INTEGER,
      confirmedAt: DataTypes.DATE,
      status: DataTypes.STRING,
      note: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'SickApprovalFlow',
    },
  );
  return SickApprovalFlow;
};
