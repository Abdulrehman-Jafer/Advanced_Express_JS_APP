const {DataTypes} = require("sequelize");
const sequelize = require("../util/database")


const User = sequelize.define("user",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true, // primary key will handle not null and uniqueness
    },
    name:DataTypes.STRING,
    email:DataTypes.STRING
})

module.exports = User;