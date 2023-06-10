const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const errorController = require('./controllers/error');
const User = require('./models/user');
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new MongoDBStore({
  uri: "mongodb+srv://Abdulrehman-Jafer:Paswordhai2007@node-cluster.e3ibxci.mongodb.net/udemyCourse?retryWrites=true&w=majority",
  collection:"sessions",
})

store.on("error",(err)=>console.log(err,"MONGODBSTORE LINE 21 ./app.js"))

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: "secret",resave: false,saveUninitialized:false,store:store,cookie:{ maxAge:1000 * 60 * 60 * 24 * 7 }})) // 1 week


app.use( async (req,res,next) => {
  if(!req.session.user){
    console.log("Not User")
    return next()
  }
  console.log(req.session)
  const user = await User.findById(req.session.user._id)
    req.user = user;
    return next();
})


app.use('/admin', adminRoutes);
app.use("/auth",authRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://Abdulrehman-Jafer:Paswordhai2007@node-cluster.e3ibxci.mongodb.net/udemyCourse?retryWrites=true&w=majority"
  )
  .then(()=> app.listen(3000))
  .then(()=> console.log("Listening"))
  .catch(err => console.log(err));
