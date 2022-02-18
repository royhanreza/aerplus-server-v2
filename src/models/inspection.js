const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Inspection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Inspection.belongsTo(models.Employee, {
        foreignKey: 'employeeId',
        as: 'employee',
      });
    }
  }
  Inspection.init(
    {
      employeeId: DataTypes.INTEGER,
      datetime: DataTypes.DATE,
      latitude: DataTypes.STRING,
      longitude: DataTypes.STRING,
      address: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Inspection',
    },
  );
  return Inspection;
};
