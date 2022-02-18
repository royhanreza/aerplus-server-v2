const { Sequelize } = require('sequelize');
const config = require('../config');

// eslint-disable-next-line object-curly-newline
const { dbDatabase, dbUsername, dbPassword, dbHost } = config;

const sequelize = new Sequelize(dbDatabase, dbUsername, dbPassword, {
  host: dbHost,
  dialect: 'mysql',
});

module.exports = sequelize;
