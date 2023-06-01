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

// const {getDb} = require("../util/database")
const {ObjectId} = require("mongodb")

// class User {
//   constructor(name,email){
//     this.name = name;
//     this.email = email
//     this.cart = []
//   }

//   save(){
//     const db = getDb()
//     return db.collection("users").insertOne(this)
//   }

//   static addToCart(user,product) {
//     const db = getDb()
//     const userId = user._id
//     const userCart = user.cart
    
//     const index = userCart.findIndex((p)=>{
//      return p.productId.equals(product._id)
//     })
//     console.log(index)
//     if(index !== -1){
//       const cartItem = {productId:new ObjectId(product._id),quantity:userCart[index].quantity + 1}
//       userCart[index] = cartItem;
//       console.log("Updating")
//       return db.collection("users")
//       .updateOne({_id: new ObjectId(userId)},{ $set:{cart: userCart }})
//     }
//     const cartItem = {productId: new ObjectId(product._id),quantity:1}
//     console.log("Pushing")
//     return db.collection("users")
//     .updateOne({_id: new ObjectId(userId)},{ $push:{cart: cartItem }})
//   }

//   static getCart(user){
//     const db = getDb()
//     const cart = user.cart
//     const productIds = cart.map((prod) => prod.productId)
//     return db.collection("products").find({_id:{$in:productIds}}).toArray().then((products) => {
//      return products.map((product)=>{
//         const quantity = cart.find(p => {
//          return p.productId.equals(product._id) 
//         }).quantity
//         return {...product,quantity}
//       })
//     })
//   }

//   static postOrder (user){
//     const db = getDb()
//     return this.getCart(user).then(products => {
//       const order = {
//         products : products,
//         user : {
//           _id: new ObjectId(user._id),
//           name:user.name
//         }
//       }
//       return db.collection("orders").insertOne(order).then(()=>{
//        return db.collection("users").updateOne({_id: new ObjectId(user._id)},{$set:{cart:[]}})
//       })
//     })
//   }

//   static getOrder (user){
//     const db = getDb()
//     return db.collection("orders").find({"user._id": new ObjectId(user._id)}).toArray()
//   }

//   static findOne(userId){
//     const db = getDb()
//     return db.collection("users").findOne({_id: new ObjectId(userId)})
//   }

//   static deleteOneFromCart(user,productId){
//     const db = getDb()
//     const cart = user.cart
//     const modifiedCart = cart.filter(p => !p.productId.equals(productId))
//     return db.collection("users").updateOne({_id: new ObjectId(user._id)},{$set:{cart:modifiedCart}})
//   }
// }


const { Schema, model } = require("mongoose")

const schema = new Schema({
 name : {
  type: Schema.Types.String,
  required: function () {
    return this.name.trim().length > 2
  }
 },
 email : {
  type: Schema.Types.String,
  required: true,
 },

 cart : [{
  productId: {
  type: Schema.Types.ObjectId,
  ref : "Product",
  required: true
},
  quantity: {
    type: Schema.Types.Number,
    default: 1,
    required: true
  }
 }]
})

schema.statics.addToCart = function(user,product){
  const cart = user.cart

  const index  = cart.findIndex((p) => {
    return p.productId.equals(product._id)
  })

  if(index != -1){
    const cartItem = { productId: product._id, quantity : cart[index].quantity + 1}
    let updatedCart = [...cart]
    updatedCart[index] = cartItem;
    return this.updateOne({_id : new ObjectId(user._id)},{$set:{cart: updatedCart}})
  }

  return this.updateOne({_id: new ObjectId(user._id)},{$push:{cart: { productId: product._id, quantity : 1 }}})
}

schema.statics.getCart = async function(user){
 return this.findById(user._id).populate("cart.productId").exec()
}

schema.statics.deleteOneFromCart = function (user,productId) {   
   const cart = user.cart
   const modifiedCart = cart.filter(p => !p.productId.equals(productId))
   return this.updateOne({_id: new ObjectId(user._id)},{$set:{cart:modifiedCart}})
}

const User = model("User",schema)
module.exports = User;
