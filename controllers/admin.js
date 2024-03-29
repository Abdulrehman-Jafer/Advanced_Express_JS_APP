
const Product = require('../models/product');
const fs = require("fs")
const path = require("path")

const deleteFile = (filePath) => {
  const absolutePath = path.join(__dirname , "../" , filePath) 
  fs.unlink(absolutePath,(err)=>{
    if(err){
      return new Error("Error while Deleting",err)
    }
  })
}

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if(!image){
    console.log({file:req.file})
    req.flash("error","Invalid Image format")
    return res.status(422).redirect("/admin/add-product")
  }
  const imageUrl = "/" + image.path
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then(() => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findOne({_id : prodId, userId: req.user._id})
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      next(error)
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImage = req.file;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then(product => {
      if(product.userId.equals(req.user._id)){
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        if(updatedImage){
          deleteFile(product.imageUrl)
          product.imageUrl = "/" + updatedImage.path;
        }
        return product.save()
        .then(() => {
          console.log('UPDATED PRODUCT!');
          res.redirect('/admin/products');
        })
      } else {
        return res.redirect("/")
      }
    })
      .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      next(error)
    });
};

exports.getProducts = (req, res, next) => {
  const products_per_page = 2;
  const page = +req.query.page || 1
  let totalProducts;
  Product.find({userId: req.user._id }).countDocuments((err,count) => {
    totalProducts = count;
  }).then(()=>{
   return Product.find({userId: req.user._id }).skip((page - 1) * products_per_page).limit(products_per_page)
  })
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.session.isLoggedIn,
        hasNextPage : page * products_per_page < totalProducts,
        hasPrevPage: page > 1,
        nextPage :page + 1,
        prevPage : page - 1,
        currentPage: page,
        lastPage : Math.ceil(totalProducts/products_per_page)
      });
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      next(error)
    });
};

exports.deleteProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  console.log(prodId)
  const product = await Product.findById(prodId)
  if(product.userId.equals(req.user._id)){
     deleteFile(product.imageUrl)
     Product.deleteOne({_id: product._id})
      .then(() => {
       res.status(200).json({message:"Successful"})
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({error: "Could not delete the product"})
    });
  } else {
    console.log("unauthorized")
    res.redirect("/")
  }
};
