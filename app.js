const path = require('path');
const sequelize = require("./util/database")
const Product = require("./models/product")
const User = require("./models/user")

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req,res,next)=>{
    // adding a middleware and getting the user data and passing into the next middlewares
    // after defining req.user
    // just a dummy logged in user 
    User.findOne({where:{id:1}}).then(user=>{
        req.user = user
        next()
    }).catch(err => console.log(err))
})
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

User.hasMany(Product,{foreignKey:"user_id",onDelete:"CASCADE"})
Product.belongsTo(User,{foreignKey:"user_id",onDelete:"CASCADE"})

sequelize.sync()
.then(() =>{
    app.listen(3000, async()=>{
        console.log("Listening")
        try {
            await sequelize.authenticate()
            console.log("Connection has been established successfully")
        } catch (error) {
            console.error(error)
    }});
    
})
.catch(err => console.error(err))
// A model can be synchronized with the database by calling model.sync(options), 
// an asynchronous function (that returns a Promise). With this call, 
// Sequelize will automatically perform an SQL query to the database.
// Note that this changes only the table in the database, not the model in the JavaScript side.

