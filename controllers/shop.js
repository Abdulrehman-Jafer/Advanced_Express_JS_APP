const Product = require('../models/product');
const Order = require('../models/order');
const fs = require("fs")
const path = require("path")
const pdfDocument = require("pdfkit")

exports.getProducts = (req, res, next) => {
  Product.find()
  .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      next(error)
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      next(error)
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      next(error)
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      next(error)
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      next(error)
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      next(error)
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      next(error)
    });
};
//C:\Users\abdul\OneDrive\Desktop\Node-JS\data\invoices\invoice-6496b443650d054290136bb3.pdf
exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId).then(order => {
    if(!order){
      return next(new Error("no order found!"))
    }
    if(!order.user.userId.equals(req.session.user._id)){
      return next(new Error("Unauthorized!!"))
    }
    const filename = "invoice-" + orderId + ".pdf";
    const invoicePath = path.join(__dirname,"../","data","invoices",filename)
    // fs.readFile(path.join("data", "invoices", filename), (err, data) => {
    //   if (err) return next(err);
    //   console.log(data);
    //   res.setHeader("Content-Type", "application/pdf");
    //   res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    //   res.send(data);
    // });
    // res.setHeader("Content-Type", "application/pdf");
    // res.setHeader('Content-Disposition', `inline; filename=${filename}`);
    // res.sendFile(path.join(__dirname,"../","data","invoices",filename))
    // console.log(invoicePath)
    // const file = fs.createReadStream(invoicePath)
    // res.setHeader("Content-Type", "application/pdf");
    // res.setHeader('Content-Disposition', `inline; filename=${filename}`);
    // file.pipe(res)
    const pdfDoc = new pdfDocument()
    pdfDoc.pipe(fs.createWriteStream(invoicePath))
    pdfDoc.pipe(res)

    pdfDoc.fontSize(26).text("Invoice")
    pdfDoc.text("--------------------------")
    let total = 0;
    order.products.forEach((prod,i) => {
      total += prod.product.price * prod.quantity
      pdfDoc.fontSize(16).text(`Product#${i + 1} ${prod.product.title} (${prod.quantity})`)
     })
     pdfDoc.text()
     pdfDoc.fontSize(26).text("--------------------------")
     pdfDoc.fontSize(18).text(`Total Price = $${total}`)
    pdfDoc.end()
  }).catch(err => next(err))
};