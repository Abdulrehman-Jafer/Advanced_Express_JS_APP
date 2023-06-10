const User = require("../models/user")

exports.getLogin = (req, res, next) => {
  console.log("login",req.session.isLoggedIn)
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postLogin = async (req,res,next) => {
  const user = await User.findById("647215d1c1681c5e88e7fc2d")
  req.session.user = user;
  req.session.isLoggedIn = true;

  try {
      await req.session.save((error) => {
        if(error){
          console.log(error,"POST LOGIN ./controllers/auth.js")
          res.redirect("/login")
        } else {
          res.redirect("/")
        }
      })
  } catch (error) {
    console.log(error,"POST LOGIN ./controllers/auth.js")
    res.redirect("/login")
  }
}

exports.logOut = async (req,res,next) => {
  await req.session.destroy()
  res.redirect("/")
}