const path = require('node:path')
const express = require('express')
const {products} = require('./admin')

const rootDir = require('../util/path')

const router = express.Router()


router.get('/',(req,res,next)=>{
    // res.send('<h1>Hello from Express</h1>') // Header will be set automatically by such as {'Content-Type','text/html'}
    console.log(products)
   // const absolutePath = path.join(rootDir,'views','shop.html') // __dirname is a global variable which hold the absolute path to the current directory and via join we can concate it to any folder
   // res.sendFile(absolutePath,(err)=>err && console.log(err)) // can't provide the relative path need absolute path
   res.render('shop',{products,domTitle:'My Shop',path:'/',hasProducts:products.length > 0,productCSS:true}) //for rendering templates also we dont need to specify paths as we have already done it in the main file and also don't need to define the extension for file it will know that we are using pug engine
   //injecting dynamic data into the template
   //we can use these values by using #{<keyname>}
})

module.exports = router