const express = require("express");
const router = express.Router();
const {products} = require("./admin");

router.get('/', (req, res, next) => {

    res.render('shop',
        {
            prods: products, pageTitle: 'shop', path: "/"
        }
    )
})

module.exports = router;