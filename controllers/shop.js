const Product = require('../models/product')

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
// }

exports.getProduct = (req, res, next) => {
    const {productId} = req.params;

    Product.findById(productId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: "/products"
            })
        }).catch(err => console.log(err))

}

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/index',
                {
                    prods: products,
                    pageTitle: 'shop',
                    path: "/"
                }
            )
        }).catch(err => console.log(err));

}

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(
            products => {
                res.render('shop/cart',
                    {
                        pageTitle: 'Your Cart',
                        path: "/cart",
                        products: products
                    }
                )
            }).catch(
        err => console.log(err)
    );

}

exports.postCart = (req, res, next) => {
    const {productId} = req.body;
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product)
        })
        .catch(err => console.log(err))
        .then(result => {
            res.redirect('/cart')
        })
}

exports.postCartDeleteProduct = (req, res, next) => {
    const {productId} = req.body

    req.user.deleteItemsFromCart(productId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders({include: ['products']})
        .then(orders => {
            res.render('shop/orders',
                {
                    pageTitle: 'Your Orders',
                    path: "/orders",
                    orders
                }
            )
        })
        .catch(err => console.log(err))

}

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    return order.addProducts(
                        products.map(product => {
                            product.orderItem = {quantity: product.cartItem.quantity}
                            return product
                        })
                    )
                })
                .catch(err => console.log(err))
        }).then(result => {
        fetchedCart.setProducts(null);
    }).then(result => {
        res.redirect('/orders')
    })
        .catch(err => console.log(err))

}

exports.getCheckout = (req, res, next) => {
    res.render('shop/index',
        {
            pageTitle: 'Checkout',
            path: "/checkout"
        }
    )
}