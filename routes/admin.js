const express = require("express");
const {
    getAddProduct, postAddProduct, getAdminProducts, getEditProduct, postEditProduct, deleteProduct
} = require("../controllers/admin");
const router = express.Router();
const isAuth = require('../middleware/is-auth')
const {body} = require('express-validator');

router.get('/add-product', isAuth, getAddProduct)
router.post('/add-product',
    [
        body('title').isString().isLength({min: 3}).trim(),
        // body('imageUrl').isURL(),
        body('price').isFloat(),
        body('description').isLength({min: 5, max: 400}).trim()
    ]
    , isAuth, postAddProduct)

router.get('/products', isAuth, getAdminProducts)

router.get('/edit-product/:productId', isAuth, getEditProduct)
router.post('/edit-product',
    [
        body('title').isString().isLength({min: 3}).trim(),
        // body('imageUrl').isURL(),
        body('price').isFloat(),
        body('description').isLength({min: 5, max: 400}).trim()
    ]
    , isAuth, postEditProduct)

// router.post('/delete-product', isAuth, postDeleteProduct)
router.delete('/product/:productId', isAuth, deleteProduct)

module.exports = router;