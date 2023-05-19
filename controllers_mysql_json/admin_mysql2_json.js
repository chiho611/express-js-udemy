const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        // productCSS: true,
        // formsCSS: true,
        // activeAddProduct: true
    })
}

exports.postAddProduct = (req, res, next) => {
    const {title, imageUrl, price, description} = req.body;

    // mysql 2
    const products = new Product(null, title, imageUrl, price, description)
    products.save().then(() => {
        res.redirect('/');
    }).catch(
        err => {
            console.log(err);
        }
    );

    //from Json
    // products.save();
    // res.redirect('/');
}

exports.getEditProduct = (req, res, next) => {
    const {productId} = req.params;

    mysql2
    Product.findById(productId, product => {
        if (!product) {
            return res.redirect('/')
        }
        res.render("admin/edit-product", {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: true,
            product
        })
    })
}

exports.postEditProduct = (req, res, next) => {
    const {productId, title, imageUrl, price, description} = req.body;

    // mysql2
    const updatedProduct = new Product(productId, title, imageUrl, price, description);
    updatedProduct.save();
}

exports.getAdminProducts = (req, res, next) => {

    // mysql2
    Product.fetchAll(products => {
        res.render("admin/products", {
            prods: products,
            pageTitle: "Admin Products",
            path: "/admin/products"
        })
    });
}

exports.postDeleteProduct = (req, res, next) => {
    const {productId} = req.body;

    // mysql2
    Product.deleteById(productId)
}