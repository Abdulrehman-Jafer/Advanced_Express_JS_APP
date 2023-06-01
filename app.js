const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const {client} = require("./util/database")
const User = require("./models/user");
const { ObjectId } = require('mongodb');

const app = express();
dotenv.config()

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) => {
  if(req.user){
    return (next())
  } else {
    const userId = "647215d1c1681c5e88e7fc2d";
    const user = User.findOne({_id: new ObjectId(userId)}).then((user)=>{
      if(user){
        req.user = user;
        next()
      }
      else {
        throw "No user"
      }
    })
    .catch(err => console.log(err))
  }
})


app.use('/admin', adminRoutes);
app.use('/',shopRoutes);

app.use(errorController.get404);

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  app.listen(3000,()=>{
    console.log("Listening")
  })
}).catch(err => console.log(err))
  

