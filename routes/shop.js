const express = require("express");
const router = express.Router();
const {products} = require("./admin");

router.get('/', (req, res, next) => {

    res.render('shop',
        {
            prods: products,
            pageTitle: 'shop',
            path: "/",
            hasProduct: products.length > 0,
            productCSS : true,
            activeShop : true
        }
    )
})

module.exports = router;