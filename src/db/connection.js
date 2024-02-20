const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  database: 'olx8',
  username: 'root',
  password: 'conmigo6226DCM',
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;