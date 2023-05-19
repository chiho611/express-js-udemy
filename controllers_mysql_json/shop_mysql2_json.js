const Product = require('../models/product')
const Cart = require('../models/cart')

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

    // mysql2
    Product.findById(productId).then(([product]) =>
        res.render('shop/product-detail', {
            product: product[0],
            pageTitle: product[0].title,
            path: "/products"
        }))
        .catch(
            err => console.log(err)
        )
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

    // mysql2
    Product.fetchAll().then(
        ([rows, fieldData]) => {
            // console.log(rows)
            res.render('shop/index',
                {
                    prods: rows,
                    pageTitle: 'shop',
                    path: "/"
                }
            )
        }
    ).catch(
        err => {
            console.log(err)
        }
    )

    //from JSON
    // Product.fetchAll(products => {
    //
    // });
}

exports.getCart = (req, res, next) => {

    //From Json file
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

    //mysql 2
    Product.findById(productId, product => {
        Cart.addProduct(productId, product.price)
    })
}

exports.postCartDeleteProduct = (req, res, next) => {

    // From Json
    Product.findById(productId, product => {
        Cart.deleteProduct(productId, product.price);
        res.redirect('/cart');
    })

}

// exports.getOrders = (req, res, next) => {
//     req.user.getOrders({include:['products']})
//         .then(orders => {
//             res.render('shop/orders',
//                 {
//                     pageTitle: 'Your Orders',
//                     path: "/orders",
//                     orders
//                 }
//             )
//         })
//         .catch(err => console.log(err))
//
// }
//
// exports.postOrder = (req, res, next) => {
//     let fetchedCart;
//     req.user.getCart()
//         .then(cart => {
//             fetchedCart = cart;
//             return cart.getProducts();
//         })
//         .then(products => {
//             return req.user.createOrder()
//                 .then(order => {
//                     return order.addProducts(
//                         products.map(product => {
//                             product.orderItem = {quantity: product.cartItem.quantity}
//                             return product
//                         })
//                     )
//                 })
//                 .catch(err => console.log(err))
//         }).then(result => {
//         fetchedCart.setProducts(null);
//     }).then(result => {
//         res.redirect('/orders')
//     })
//         .catch(err => console.log(err))
//
// }

exports.getCheckout = (req, res, next) => {
    res.render('shop/index',
        {
            pageTitle: 'Checkout',
            path: "/checkout"
        }
    )
}