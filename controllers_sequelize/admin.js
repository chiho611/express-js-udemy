const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false
    })
}

exports.postAddProduct = (req, res, next) => {
    const {title, imageUrl, price, description} = req.body;

    req.user.createProduct({
        title,
        imageUrl,
        price,
        description
    })
        // Product.create({
        //     title,
        //     imageUrl,
        //     price,
        //     description,
        //     userId: req.user.id
        // })
        .then(result => {
            console.log(result)
            res.redirect('/admin/products');
        }).catch(err => {
        console.log(err)
    })
}

exports.getEditProduct = (req, res, next) => {
    const {productId} = req.params;
    Product.findByPk(productId).then(product => {
        if (!product) {
            return res.redirect('/')
        }
        res.render("admin/edit-product", {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: true,
            product
        })
    }).catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
    const {productId, title, imageUrl, price, description} = req.body;

    Product.findByPk(productId).then(product => {
        product.title = title;
        product.imageUrl = imageUrl;
        product.price = price;
        product.description = description;
        return product.save();
    }).then(result => {
        console.log(result)
        res.redirect('/admin/products')
    })
        .catch(
            err => console.log(err)
        )
}

exports.getAdminProducts = (req, res, next) => {

    req.user.getProducts()
        .then(products => {
            res.render("admin/products", {
                prods: products,
                pageTitle: "Admin Products",
                path: "/admin/products"
            })
        })
        .catch(err => console.log(err));

}

exports.postDeleteProduct = (req, res, next) => {
    const {productId} = req.body;

    Product.findByPk(productId).then(product => {
        return product.destroy();
    })
        .then(result => {
            console.log("product destroyed", result)
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err)
        })
}