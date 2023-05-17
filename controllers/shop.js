const Product = require('../models/product')
const Cart = require('../models/cart')
const e = require("express");

// exports.getAllProduct = (req, res, next) => {
//     Product.findAll().then(products => {
//         res.render('shop/product-list',
//             {
//                 prods: products,
//                 pageTitle: 'All Products',
//                 path: "/products"
//             }
//         )
//     }).catch(err => console.log(err));
//     //mysql 2
//
// //     Product.fetchAll().then(
// //         ([rows, fieldData]) => {
// //             // console.log(rows)
// //             res.render('shop/product-list',
// //                 {
// //                     prods: rows,
// //                     pageTitle: 'All Products',
// //                     path: "/products"
// //                 }
// //             )
// //         }
// //     ).catch(
// //         err => {
// //             console.log(err)
// //         }
// //     )
// }

exports.getProduct = (req, res, next) => {
    const {productId} = req.params;

    Product.findAll({where: {id: productId}})
        .then(products => {
            res.render('shop/product-detail', {
                product: products[0],
                pageTitle: products[0].title,
                path: "/products"
            })
        }).catch(err => console.log(err))

    // Product.findByPk(productId).then(product => {
    //     res.render('shop/product-detail', {
    //         product: product,
    //         pageTitle: product.title,
    //         path: "/products"
    //     })
    // }).catch(err => console.log(err))

    // mysql2
    // Product.findById(productId).then(([product]) =>
    //     res.render('shop/product-detail', {
    //         product: product[0],
    //         pageTitle: product[0].title,
    //         path: "/products"
    //     }))
    //     .catch(
    //         err => console.log(err)
    //     )
    //From Json
    // Product.findById(productId, product => {
    //     res.render('shop/product-detail', {
    //         product,
    //         pageTitle: 'product detail',
    //         path: "/products"
    //     })
    // })
}

exports.getIndex = (req, res, next) => {
    Product.findAll().then(products => {
        res.render('shop/index',
            {
                prods: products,
                pageTitle: 'shop',
                path: "/"
            }
        )
    }).catch(err => console.log(err));

    // mysql2
    // Product.fetchAll().then(
    //     ([rows, fieldData]) => {
    //         // console.log(rows)
    //         res.render('shop/index',
    //             {
    //                 prods: rows,
    //                 pageTitle: 'shop',
    //                 path: "/"
    //             }
    //         )
    //     }
    // ).catch(
    //     err => {
    //         console.log(err)
    //     }
    // )

    //from JSON
    // Product.fetchAll(products => {
    //
    // });
}

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (let product of products) {
                const cartProductData = cart.products.find(p => p.id === product.id);
                if (cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty})
                }
                res.render('shop/cart',
                    {
                        pageTitle: 'Your Cart',
                        path: "/cart",
                        products: cartProducts
                    }
                )
            }
        })
    })
}

exports.postCart = (req, res, next) => {
    const {productId} = req.body;
    Product.findById(productId, product => {
        Cart.addProduct(productId, product.price)
    })
    res.redirect('/')
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

exports.postCartDeleteProduct = (req, res, next) => {
    const {productId} = req.body
    Product.findById(productId, product => {
        Cart.deleteProduct(productId, product.price);
        res.redirect('/');
    })

}