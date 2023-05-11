const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render("admin/add-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        // productCSS: true,
        // formsCSS: true,
        // activeAddProduct: true
    })
}


exports.postAddProduct = (req, res, next) => {
    const {title, imageUrl, price, description} = req.body;
    const products = new Product(title, imageUrl, price, description)
    products.save();
    res.redirect('/');
}

exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render("admin/products", {
            prods: products,
            pageTitle: "Admin Products",
            path: "/admin/products"
        })
    });

}