const express = require('express');
const authController = require('../controllers/auth');
const { body } = require("express-validator")
const User = require("../models/user")

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
body("email").normalizeEmail().isEmail().withMessage("Please type a valid email"),
 authController.postLogin);

router.post('/signup', 
body("email").normalizeEmail().isEmail().withMessage("Please type a valid email").custom((value)=>{
    return User.findOne({email:value}).then((userDoc)=>{
        if(userDoc) {
            return Promise.reject("User with this email already exists")
        }
        return true
    })
}),
body("password",
"Password should be six charater long with at least one special character, a number,an uppercase and a lowercase.")
.isStrongPassword(
    {
        minLength: 6,
        minLowercase: 1,
        minUppercase:1,
        minSymbols:1,
        minNumbers:1
    }),
    body("confirmPassword").custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error("Password and Confirm Password does not match")
        }
        return true
    })
, authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getResetPassword);

router.post('/reset', authController.postResetPassword);

router.get('/new-password/:resetToken', authController.getNewPasssword);

router.post('/new-password', authController.postNewPasssword);

module.exports = router;