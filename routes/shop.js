const express = require("express");
const router = express.Router();
const {getAllProduct, getIndex, getCart, getCheckout, getOrders, getProduct, postCart, postCartDeleteProduct} = require("../controllers/shop");

router.get('/', getIndex);
router.get('/products', getAllProduct);
router.get('/products/:productId', getProduct);

router.get('/cart', getCart);
router.post('/cart', postCart);
router.post('/cart-delete-item', postCartDeleteProduct);

router.get('/orders', getOrders);
router.get('/checkout', getCheckout);

module.exports = router;