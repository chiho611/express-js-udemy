const Product = require('../models/product')

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

}

exports.getCart = (req, res, next) => {
    req.user.getCart().then(cart => {
        return cart.getProducts().then(
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
    }).catch(err => console.log(err));

}

exports.postCart = (req, res, next) => {
    const {productId} = req.body;
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({where: {id: productId}})
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0]
            }
            let newQuantity = 1;
            if (product) {
                // console.log(product.cartItem.quantity)
                newQuantity = product.cartItem.quantity + 1
            }
            return Product.findByPk(productId).then(product => {
                fetchedCart.addProduct(product, {through: {quantity: newQuantity}})
            }).catch(err => console.log(err))
        }).then((product) => {
        res.redirect('/cart')
    })
        .catch(err => console.log(err))

}

exports.postCartDeleteProduct = (req, res, next) => {
    const {productId} = req.body

    req.user.getCart()
        .then(cart => {
            console.log('cart', cart)
            return cart.getProducts({where: {id: productId}})
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
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