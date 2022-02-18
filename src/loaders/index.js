const expressLoader = require('./express');
const Logger = require('./logger');
const sequelize = require('./sequelize');

module.exports = async ({ expressApp }) => {
  // It returns the agenda instance because it's needed in the subsequent loaders
  try {
    await sequelize.authenticate();
    Logger.info('Database connection has been established successfully');
  } catch (error) {
    Logger.error('Unable to connect database: ', error);
  }

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
