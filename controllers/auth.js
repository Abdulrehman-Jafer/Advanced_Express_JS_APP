const User = require('../models/user');
const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer")
const sgTransport = require("nodemailer-sendgrid-transport")
const crypto = require("crypto");
const { validationResult } = require("express-validator")

const MAILFROM = "abdulrehmanjaferworks01233@gmail.com" // Sender setted in send grid


exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errorMessage : req.flash("error")[0],
    oldInput: { email:"",password:"",},
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: req.flash("error")[0],
    oldInput: { email:"",password:"",confirmPassword:"" },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const {email,password} = req.body
  if(!validationResult(req).isEmpty()){
    req.flash("error",validationResult(req).array()[0].msg)
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Log In',
      isAuthenticated: false,
      errorMessage: req.flash("error")[0],
      oldInput: { email,password },
      validationErrors: validationResult(req).array()
    });
  }
  User.findOne({email})
    .then(user => {
      if(!user) {
        req.flash("error","Incorrect email or password")
        return res.redirect("/login")
      }
      bcrypt.compare(password,user.password).then((matched)=>{
        if(matched){
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save(err => {
            if(err) return console.log(err);

            return res.redirect('/')
          });
        } else {
          req.flash("error","Incorrect email or password")
          return res.status(422).redirect("/login")
        }
      })
    })
    .catch(err => {
      console.log(err)
      return res.redirect("/login")
    });
};

exports.postSignup = (req, res, next) => {
  const { email,password,confirmPassword } = req.body //Strong@1
  //VaLIDATION wIll Be Done but not right now;
  if(!validationResult(req).isEmpty()){
    req.flash("error",validationResult(req).array()[0].msg)
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      errorMessage: req.flash("error")[0],
      oldInput: { email,password,confirmPassword },
      validationErrors: validationResult(req).array()
    });
  }
  try {
    bcrypt.hash(password,12)
    .then( hashedPassword => {
      const user = new User({
        email, 
        password: hashedPassword
      })
      return user.save();
    })
    .then(()=> {
      // Can redirect without awaiting the mail delivery
      res.redirect("/login")
      // Mail will be sent
      nodemailer.createTransport(sgTransport({
        auth:{
          api_key: "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"
        }
      })).sendMail({
          to:email,
          from:MAILFROM,
          subject:"Sign Up Status",
          text:"Hi there!",
          html:"<h1>Sign Up Successful</h1>"
        },(err,res) => {
          if(err){
            console.log(err,"MAIL ERROR")
          }
          console.log(res,"Mail Sent Successful")
        })
    })
  } catch (error) {
    console.log(error)
    req.flash("error",error.msg)
    return res.redirect("/signup")
  }
  };

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getResetPassword = async (req,res,next) => {
    return res.render('auth/reset', {
      path: '/reset',
      pageTitle: 'Reset',
      isAuthenticated: req.session.isLoggedIn,
      errorMessage : req.flash("error")[0]
})
}

exports.postResetPassword = async (req,res,next) => {
const email = req.body.email
try {
  const user = await User.findOne({email})
  if(!user){
    req.flash("error","Account does not exist")
    return res.redirect("/reset")
  }
   crypto.randomBytes(32,(err,buff) => {
    if(err) {
      req.flash("error","Something went wrong while creating Token")
      return res.redirect("/reset")
    }
    const resetToken = buff.toString("hex")
    user.resetToken = resetToken
    user.resetTokenExpiry = Date.now() + 3600000 // 1 hour
    user.save().then(()=>{
      nodemailer.createTransport(sgTransport({
        auth:{
          api_key: "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"
        }
      })).sendMail({
          to: email,
          from:MAILFROM,
          subject:"Reset Password",
          html:`
          <p>Reset Password request was submitted</p>
          <p>Click this <a href=http://localhost:3000/new-password/${resetToken}>link</a> to reset Password</p>`
        },(err) => {
          if(err){
            return console.log(err,"MAIL ERROR")
          }
          else {
            console.log("Mail Sent Successful")
            req.flash("error","Check your email to reset Password")
            return res.redirect("/login")
          }
        })
    })
  })
} catch (error) {
  console.log(error)
  return res.redirect("/reset")
}
}

exports.getNewPasssword = async (req,res,next) => {
 const resetToken = req.params.resetToken
 if(!resetToken) return res.redirect("/")
 const user = await User.findOne({resetToken})
 if(!user){
  req.flash("error","could not reset Password")
  return res.redirect("/")
 }
 res.render("auth/new-password",{
  path: '/new-password',
  pageTitle: 'New Password',
  isAuthenticated: req.session.isLoggedIn,
  errorMessage : req.flash("error")[0],
  resetToken: resetToken,
  userId : user._id.toString()
 })
}

exports.postNewPasssword = async (req,res,next) => {
 const {userId,resetToken,password} = req.body
 if(!userId || !resetToken || !password) return res.redirect("/")
 const user = await User.findOne({_id: userId,resetToken: resetToken,resetTokenExpiry:{$gt:Date.now()}})
 if(!user){
  req.flash("error","could not reset Password")
  return res.redirect("/login")
 }
 try {
  const hashedPassword = await bcrypt.hash(password,12);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save().then(()=>{
    req.flash("error","Password Reset was Successfull")
    res.redirect("/login")
  })
 } catch (error) {
  req.flash("error","Something went wrong")
  console.log(error)
  res.redirect("login")
 }
}