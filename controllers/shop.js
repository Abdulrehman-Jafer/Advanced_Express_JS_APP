const { ObjectId } = require('mongodb');
const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll ()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
   User.getCart(req.user)
   .then((user)=>{
     console.log(user)
     return res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: user.cart
    });
   })
   .catch(err => console.log(err))
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
  .then(prod=>{
    User.addToCart(req.user,prod).then(() => {
      res.redirect("/cart")
      console.log("Added to Cart")
    })
  })
  .catch(err => console.log(err))
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
    User.deleteOneFromCart(req.user,prodId)
    .then(()=> {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  User.getCart(req.user).then((user)=>{
    const products = user.cart.map(p => ({quantity: p.quantity, product: {...p.productId}}))
    const order = new Order({
      products: products,
      user : { name: user.name, userId: new ObjectId(user._id)}
    })
    order.save().then(()=>User.updateOne( {_id: new ObjectId(user._id)}, {$set:{ cart: []}}))
    .then(()=>res.redirect('/orders'))
  })
  .catch(err => console.log(err))
};

exports.getOrders = (req, res, next) => {
  Order.find({"user.userId": new ObjectId(req.user._id)})
  .then((orders) => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
  })})
  .catch(err => console.log(err))
};
