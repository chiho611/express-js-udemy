const express = require("express");
const {
    getAddProduct, postAddProduct, getAdminProducts, getEditProduct, postEditProduct, postDeleteProduct
} = require("../controllers/admin");
const router = express.Router();
const isAuth = require('../middleware/is-auth')

router.get('/add-product', isAuth, getAddProduct)
router.post('/add-product', isAuth, postAddProduct)

router.get('/products', isAuth, getAdminProducts)

router.get('/edit-product/:productId', isAuth, getEditProduct)
router.post('/edit-product', isAuth, postEditProduct)

router.post('/delete-product', isAuth, postDeleteProduct)

module.exports = router;