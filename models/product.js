// const { getDb } = require("../util/database")
const {ObjectId} = require("mongodb")
const mongoose = require("mongoose")
// const Product = sequelize.define('product', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// });

// class Product {
//   constructor(title,price,imageUrl,description,userId){
//     this.title = title;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.userId = userId;
//   }
// async save(){
//       const db = getDb()
//       return db.collection("products").insertOne(this)
//       .then(res => console.log(res))
//       .catch(err => console.log(err))
// }

// static fetchAll(){
//   const db = getDb()
//   return db.collection("products").find().toArray()
//   .then(prods =>{
//     return prods;
//   })
//   .catch(err => {
//     console.log(err)
//   })
// }

// static findById(prodId){
//   const db = getDb()
//   return db.collection("products").findOne({_id: new ObjectId(prodId)})
//  }

// static updateOne(prodId,updates){
//   const db = getDb()
//   return db.collection("products").updateOne({_id:new ObjectId(prodId)},{$set:updates})
//  }

//  static deleteOne(prodId){
//   const db = getDb()
//   return db.collection("products").deleteOne({_id:new ObjectId(prodId)})
//  }
// }


const { model,Schema } = mongoose

const schema = new Schema({
  title: { 
    type:Schema.Types.String, 
    required:true 
  },
  price: {
    type:Schema.Types.String,
    required:true
  },
  imageUrl: {
    type:Schema.Types.String,
    required:true
  },
  description:{
    type:Schema.Types.String,
    required:true
  },
  userId:{
    type:Schema.Types.ObjectId, 
    ref:"User"
  }
})

schema.statics.fetchAll = function(){
  return this.find()
}

const Product = model("Product",schema)
module.exports = Product;
