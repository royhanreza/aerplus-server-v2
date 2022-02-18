const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmployeeTracker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EmployeeTracker.belongsTo(models.Employee, {
        foreignKey: 'employeeId',
        as: 'employee',
      });
    }
  }
  EmployeeTracker.init(
    {
      isTracked: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'EmployeeTracker',
    },
  );
  return EmployeeTracker;
};
