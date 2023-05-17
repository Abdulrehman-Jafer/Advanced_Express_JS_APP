// const mysql = require("mysql2")

// const pool = mysql.createPool({
//     host:"127.0.0.1",
//     user:"root",
//     database:"mydb",
//     password:"Paswordhai2007!"
// }) //pool for multiple connectionsw

// module.exports = pool.promise(); // For using promise version not callback


const {Sequelize}  = require("sequelize")
const sequelize = new Sequelize("mydb","root","Paswordhai2007!",{
dialect:"mysql",
host:"localhost",
})

module.exports = sequelize;