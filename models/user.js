// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const User = sequelize.define('user', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   name: Sequelize.STRING,
//   email: Sequelize.STRING
// });

const {getDb} = require("../util/database")
const {ObjectId} = require("mongodb")

class User {
  constructor(name,email){
    this.name = name;
    this.email = email
    this.cart = []
  }

  save(){
    const db = getDb()
    return db.collection("users").insertOne(this)
  }

  static addToCart(user,product) {
    const db = getDb()
    const userId = user._id
    const userCart = user.cart
    
    const index = userCart.findIndex((p)=>{
     return p.productId.equals(product._id)
    })
    console.log(index)
    if(index !== -1){
      const cartItem = {productId:new ObjectId(product._id),quantity:userCart[index].quantity + 1}
      userCart[index] = cartItem;
      console.log("Updating")
      return db.collection("users")
      .updateOne({_id: new ObjectId(userId)},{ $set:{cart: userCart }})
    }
    const cartItem = {productId: new ObjectId(product._id),quantity:1}
    console.log("Pushing")
    return db.collection("users")
    .updateOne({_id: new ObjectId(userId)},{ $push:{cart: cartItem }})
  }

  static getCart(user){
    const db = getDb()
    const cart = user.cart
    const productIds = cart.map((prod) => prod.productId)
    return db.collection("products").find({_id:{$in:productIds}}).toArray().then((products) => {
     return products.map((product)=>{
        const quantity = cart.find(p => {
         return p.productId.equals(product._id) 
        }).quantity
        return {...product,quantity}
      })
    })
  }

  static findOne(userId){
    const db = getDb()
    return db.collection("users").findOne({_id: new ObjectId(userId)})
  }
}
module.exports = User;
