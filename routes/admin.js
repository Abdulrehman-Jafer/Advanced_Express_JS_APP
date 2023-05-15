const path = require('node:path')
const express = require('express')
const {post_add_Product,get_add_Product} = require('../controllers/products')

const rootDir = require('../util/path')

const products = [];
const router = express.Router({caseSensitive:false})
//admin/add-product =>GET
router.get('/add-product',get_add_Product)
// (req,res,next)=>{
//     // res.setHeader('Location','/') can set header manually
// //     res.send(
// //    `<form action="/admin/add-product" method="POST">
// //     <input type="text" name="title"/>
// //     <button type="submit">Add to Products</button>
// //     </form>`) // Header will be set automatically by such as {'Content-Type','text/html'}
// //    const absolutePath = path.join(rootDir,'views','add-product.html') // work for every operating systems .. = ../
// //    res.sendFile(absolutePath,(err)=>err && console.log(err))
// res.render('add-product',{domTitle:'Add Product',path:'/admin/add-product',formCSS:true}) //rendering dynaminc html
// })
//admin/add-product =>POST
router.post('/add-product',post_add_Product)
// (req,res,next)=>{
//     products.push({title:req.body.title})
//     res.redirect('/') // res.setHeader('Location','/') can set header manually
// })
exports.router = router