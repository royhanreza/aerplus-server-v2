'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PermissionCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PermissionCategory.init(
    {
      name: DataTypes.STRING,
      maxDay: DataTypes.SMALLINT,
      active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'PermissionCategory',
    },
  );
  return PermissionCategory;
};
