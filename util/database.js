const Sequelize = require('sequelize');

const sequelize = new Sequelize('mydb', 'root', 'Paswordhai2007!', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
