/* eslint-disable strict */

'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Designation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
      // Designation.hasMany(models.Career, {
      //   as: 'careers',
      // });
    }
  }
  Designation.init(
    {
      name: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Designation',
    },
  );
  return Designation;
};
