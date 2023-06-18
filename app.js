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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
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

app.use(errorController.get404);

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
