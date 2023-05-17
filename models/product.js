const {DataTypes} = require("sequelize");

const sequelize = require("../util/database")

const Product = sequelize.define("product",{
 id : {
  type:DataTypes.INTEGER,
  autoIncrement:true,
  allowNull:false,
  primaryKey:true,
  unique:true
},
title:DataTypes.STRING,
price:{
  type:DataTypes.DOUBLE,
  allowNull:false
},
image_Url:{
  type:DataTypes.STRING,
  allowNull:false
},
description:{
  type:DataTypes.STRING,
  allowNull:false
}
})

module.exports = Product;