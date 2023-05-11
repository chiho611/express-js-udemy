const express = require("express");
const {getAddProduct, postAddProduct, getAdminProducts} = require("../controllers/admin");
const router = express.Router();


router.get('/add-product', getAddProduct)

router.get('/products', getAdminProducts)


router.post('/add-product', postAddProduct)


exports.router = router;