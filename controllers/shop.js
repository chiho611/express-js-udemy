const Product = require('../models/product')
const Order = require('../models/order')

// exports.getAllProduct = (req, res, next) => {
//     Product.findAll().then(products => {
//         res.render('shop/product-list',
//             {
//                 prods: products,
//                 pageTitle: 'All Products',
//                 path: "/products",
// isAuthenticated: req.session.isLoggedIn
//             }
//         )
//     }).catch(err => console.log(err));
// }

exports.getIndex = (req, res, next) => {
    Product.find()
        // .select('title price')
        // .populate('userId' , 'name')
        .then(products => {
            res.render('shop/index', {
                products: products,
                pageTitle: 'shop',
                path: "/"
            })
        }).catch(err => console.log(err));
}

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


exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(item => {
                return {_id: item.productId._id, title: item.productId.title, quantity: item.quantity}
            });
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: "/cart",
                products: products
            })
        }).catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        });
};

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
    Order.find({'user.userId': req.user._id})
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: "/orders",
                orders
            })
        })
        .catch(err => console.log(err))

}

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(item => {

                return {product: {...item.productId._doc}, quantity: item.quantity}
            });

            const order = new Order({
                user: {
                    email: user.email,
                    userId: user._id
                },
                products
            })
            return order.save()
        })
        .then(() => {
            return req.user.clearCart()
        }).then(() => {
        res.redirect('/orders')
    })
        .catch(err => console.log(err))

}

exports.getCheckout = (req, res, next) => {
    res.render('shop/index', {
        pageTitle: 'Checkout',
        path: "/checkout"
    })
}