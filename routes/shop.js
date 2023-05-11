const express = require("express");
const router = express.Router();
const {getProduct, getIndex, getCart, getCheckout, getOrders} = require("../controllers/shop");

router.get('/', getIndex)
router.get('/products', getProduct)
router.get('/cart', getCart)
router.get('/orders', getOrders)
router.get('/checkout', getCheckout)

module.exports = router;