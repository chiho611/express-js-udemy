const Product = require('../models/product')

exports.getProduct = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list',
            {
                prods: products,
                pageTitle: 'All Products',
                path: "/products"
                // hasProduct: products.length > 0,
                // productCSS: true,
                // activeShop: true
            }
        )
    });
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index',
            {
                prods: products,
                pageTitle: 'shop',
                path: "/"
            }
        )
    });
}

exports.getCart = (req, res, next) => {
    res.render('shop/index',
        {
            pageTitle: 'Your Cart',
            path: "/cart"
        }
    )
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders',
        {
            pageTitle: 'Your Orders',
            path: "/orders"
        }
    )
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/index',
        {
            pageTitle: 'Checkout',
            path: "/checkout"
        }
    )
}