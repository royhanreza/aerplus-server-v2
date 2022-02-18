module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Offices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      latitude: {
        allowNull: false,
        type: Sequelize.STRING('30'),
      },
      longitude: {
        allowNull: false,
        type: Sequelize.STRING('30'),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Offices');
  },
};
