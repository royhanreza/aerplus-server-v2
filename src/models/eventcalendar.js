'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventCalendar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EventCalendar.init({
    date: DataTypes.DATEONLY,
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    withLeaveSubmission: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'EventCalendar',
  });
  return EventCalendar;
};