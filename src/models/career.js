'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Career extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Career.belongsTo(models.Employee, {
        foreignKey: 'employeeId',
        as: 'employee',
      });
      Career.belongsTo(models.Designation, {
        foreignKey: 'designationId',
        as: 'designation',
      });
      Career.belongsTo(models.Department, {
        foreignKey: 'departmentId',
        as: 'department',
      });
      Career.belongsTo(models.JobTitle, {
        foreignKey: 'jobTitleId',
        as: 'jobTitle',
      });
    }
  }
  Career.init(
    {
      employeeId: DataTypes.INTEGER,
      employmentStatus: DataTypes.STRING,
      type: DataTypes.STRING,
      designationId: DataTypes.INTEGER,
      departmentId: DataTypes.INTEGER,
      jobTitleId: DataTypes.INTEGER,
      effectiveDate: DataTypes.DATEONLY,
      endOfEmploymentDate: DataTypes.DATEONLY,
      taxMethod: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Career',
    },
  );
  return Career;
};
