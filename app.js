const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');
const isAuthenticatedMiddleware = require("./middleware/is-auth")
const csrf = require("csurf")
const flash = require("connect-flash")
const multer = require("multer")

const MONGODB_URI =
  'mongodb+srv://Abdulrehman-Jafer:Paswordhai2007@node-cluster.e3ibxci.mongodb.net/udemyCourse?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf()

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const multerStorage = multer.diskStorage({
  destination: (req,file,cb) => {
     cb(null,"./uploads/productImages") // can use req object to distinguish the storage folder inside uploads
  },
  filename : (req,file,cb) => { //Windows OS doesn't accept files with a ":"
    const filename = new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname.toLowerCase().split(' ').join('-');
     cb(null,filename)
  }
})

const fileFilter = (req,file,cb) => {
  if(file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg"){
     cb(null,true);
  } else {
     cb(null,false);
     return cb (new Error("Not Valid Format"));
  }
}
app.use(multer({storage: multerStorage,fileFilter:fileFilter }).single("image"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads",express.static(path.join(__dirname,"uploads")))
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
  
app.use(csrfProtection) // for any non get request this middleware will look for a token in the form so this way
// we can avoid cross site request forgery and only the form submitted from our view e.g the POST request will
// be validated

app.use(flash())

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req,res,next) => { // Will set the following value in the response
  res.locals.csrfToken = req.csrfToken() // can also add the isAuthenticated as locals here
  next()
})

app.use('/admin', isAuthenticatedMiddleware ,adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use("/500",errorController.get500)
app.use(errorController.get404);
app.use((error,req,res,next) => {
  console.log(error)
  res.redirect("/500")
})


mongoose
  .connect(MONGODB_URI).then(()=>{
    app.listen(3000);
  })
 .then(()=>{
    console.log("Listening")
  })
  .catch(err => {
    console.log(err); 
  });
