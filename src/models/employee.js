const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Employee.hasMany(models.Inspection, {
        as: 'inspections',
        onDelete: 'cascade',
      });
      Employee.hasMany(models.Career, {
        as: 'careers',
        onDelete: 'cascade',
      });
      Employee.hasOne(models.EmployeeTracker, {
        foreignKey: 'employeeId',
        as: 'tracker',
        onDelete: 'cascade',
      });
      Employee.hasOne(models.EmployeeCredential, {
        foreignKey: 'employeeId',
        as: 'credential',
        onDelete: 'cascade',
      });
      Employee.belongsToMany(models.WorkingPattern, {
        through: models.EmployeeWorkingPatterns,
        as: 'workingPatterns',
      });
    }
  }
  Employee.init(
    {
      employeeId: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      handphone: DataTypes.STRING,
      placeOfBirth: DataTypes.STRING,
      birthDate: DataTypes.DATEONLY,
      gender: DataTypes.STRING,
      maritalStatus: DataTypes.STRING,
      bloodType: DataTypes.STRING,
      religion: DataTypes.STRING,
      identityType: DataTypes.STRING,
      identityNumber: DataTypes.STRING,
      identityExpiryDate: DataTypes.DATEONLY,
      identityAddress: DataTypes.STRING,
      postalCode: DataTypes.STRING,
      residentialAddress: DataTypes.STRING,
      photo: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Employee',
    },
  );
  return Employee;
};
