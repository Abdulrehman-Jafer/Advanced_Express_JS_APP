const { Product } = require("../models/product")

const products = [];

const get_add_Product = (req,res,next)=>{
    res.render('add-product',{domTitle:'Add Product',path:'/admin/add-product',formCSS:true})
}

const post_add_Product = (req,res,next)=>{
    const product = new Product(req.body.title)
    product.save()
    res.redirect('/')
}

const get_Products = (req,res,next)=>{
    // we define that this fetchAll will receive a cb and we call called the cb with products
    Product.fetchAll(products => {
        res.render('shop',
        {
            products:products,
            domTitle:'My Shop',
            path:'/',
            hasProducts:products.length > 0,
            productCSS:true}) 
    })
}

exports.get_add_Product = get_add_Product;
exports.post_add_Product = post_add_Product;
exports.get_Products = get_Products;