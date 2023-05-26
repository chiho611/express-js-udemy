const express = require("express");
const router = express.Router();
const {
    getAllProduct, getIndex, getCart, getCheckout, getOrders, getProduct, postCart, postCartDeleteProduct, postOrder
} = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

router.get('/', getIndex);
// router.get('/products', getAllProduct);
router.get('/products/:productId', getProduct);

router.get('/cart', isAuth, getCart);
router.post('/cart', isAuth, postCart);
router.post('/cart-delete-item', isAuth, postCartDeleteProduct);

router.get('/orders', isAuth, getOrders);
router.post('/create-order', isAuth, postOrder);

// router.get('/checkout', getCheckout);

module.exports = router;