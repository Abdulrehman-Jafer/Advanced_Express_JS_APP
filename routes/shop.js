const express = require('express');
const isAuthenticatedMiddleware = require("../middleware/is-auth")

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuthenticatedMiddleware, shopController.getCart);

router.post('/cart', isAuthenticatedMiddleware, shopController.postCart);

router.post('/cart-delete-item', isAuthenticatedMiddleware, shopController.postCartDeleteProduct);

router.post('/create-order', isAuthenticatedMiddleware, shopController.postOrder);

router.get('/orders', isAuthenticatedMiddleware, shopController.getOrders);

router.get('/orders/:orderId',isAuthenticatedMiddleware,shopController.getInvoice)

module.exports = router;
