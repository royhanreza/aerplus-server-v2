const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmployeeCredential extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EmployeeCredential.belongsTo(models.Employee, {
        foreignKey: 'employeeId',
        as: 'credential',
      });
    }
  }
  EmployeeCredential.init(
    {
      employeeId: DataTypes.INTEGER,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      mobileAccessType: DataTypes.STRING,
      isPhoneVerified: DataTypes.INTEGER,
      isEmailVerified: DataTypes.INTEGER,
      lastLogin: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'EmployeeCredential',
    },
  );
  return EmployeeCredential;
};
