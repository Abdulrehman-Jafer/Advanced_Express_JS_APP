const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const {title,image_Url,price,description} = req.body
  // return Product.create({
  //   title,
  //   image_Url,
  //   price,
  //   description,
  //   user_id: req.user.id
  // })
  req.user.createProduct({ // this method is automatically created for us for one-to-many relation 
    title,
    image_Url,
    price,
    description,
  })
  .then(()=>res.redirect("/admin/products"))
  .catch(err => console.error(err))
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findOne({where:{id:prodId}})
  .then(row=>{
     res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: row
  })})
  .catch(err => console.error(err))
}

exports.postEditProduct = (req, res, next) => {
  const {title,image_Url,price,description,productId} = req.body
  Product.update({title,image_Url,price,description},{where:{id:productId}})
  .then(()=>res.redirect('/admin/products'))
  .catch(err=>console.error(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll({})
  .then(rows => 
  res.render('admin/products', {
    prods: rows,
    pageTitle: 'Admin Products',
    path: '/admin/products'
  }))
  .catch(err => console.error(err))
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.destroy({where:{
    id:prodId
  }})
  .then(()=>res.redirect("/admin/products"))
  .catch(err=> console.error(err))
};
