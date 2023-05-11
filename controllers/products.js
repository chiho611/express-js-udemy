const Products = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render("add-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        productCSS: true,
        formsCSS: true,
        activeAddProduct: true
    })
}


exports.postAddProduct = (req, res, next) => {
    const products = new Products(req.body.title)
    products.save();
    res.redirect('/');
}

exports.getProduct = (req, res, next) => {
    Products.fetchAll(products => {
        res.render('shop',
            {
                prods: products,
                pageTitle: 'shop',
                path: "/",
                hasProduct: products.length > 0,
                productCSS: true,
                activeShop: true
            }
        )
    });

}