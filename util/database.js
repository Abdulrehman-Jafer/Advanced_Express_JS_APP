// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('mydb', 'root', 'Paswordhai2007!', {
//   dialect: 'mysql',
//   host: 'localhost'
// });


// module.exports = sequelize;

const mongodb = require("mongodb")


let db;
const client = () => mongodb.MongoClient.connect(process.env.MONGO_URI).then(client => db = client.db())


const getDb = () => {
  if(db){
    return db;
  }
  throw "db error in database.js"
}

module.exports = {client,getDb};