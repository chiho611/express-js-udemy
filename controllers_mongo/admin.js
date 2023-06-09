const Product = require('../models/product')
const mongodb = require("mongodb");

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product", path: "/admin/add-product", editing: false
    })
}

exports.postAddProduct = (req, res, next) => {
    const {title, price, description, imageUrl} = req.body;

    const product = new Product(title, price, description, imageUrl, null, req.user._id);

    product
        .save()
        .then(result => {
            res.redirect('/admin/products');
        }).catch(err => {
        console.log(err)
    })
}

exports.getEditProduct = (req, res, next) => {
    const {productId} = req.params;
    Product.findById(productId).then(product => {
        if (!product) {
            return res.redirect('/')
        }
        res.render("admin/edit-product", {
            pageTitle: "Edit Product", path: "/admin/edit-product", editing: true, product
        })
    }).catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
    const {productId, title, imageUrl, price, description} = req.body;

    const product = new Product(title, price, description, imageUrl, productId)

    product.save().then(result => {
        res.redirect('/admin/products')
    })
        .catch(err => console.log(err))
}

exports.getAdminProducts = (req, res, next) => {

    Product.fetchAll()
        .then(products => {
            res.render("admin/products", {
                prods: products, pageTitle: "Admin Products", path: "/admin/products"
            })
        })
        .catch(err => console.log(err));

}

exports.postDeleteProduct = (req, res, next) => {
    const {productId} = req.body;

    Product.deleteById(productId)
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err)
        })
}