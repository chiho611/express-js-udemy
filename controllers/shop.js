const Product = require('../models/product')
const Order = require('../models/order')
const path = require("path");
const fs = require('fs');
const PDFDocument = require('pdfkit');
const stripe = require('stripe')('sk_test_51NJlVhEd9Pz2YXSFukiu0Fagytza8q6kynqDnAVgvcRaN0XxwU0rof7jJt6ePmyPfIAQgqMq91UjuSyFc1v9Hcxu00ctSwEw7p')
const ITEM_PER_PAGE = 2;

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
    const page = Number(req.query.page || 1);
    let totalItems;
    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEM_PER_PAGE)
                .limit(ITEM_PER_PAGE)
            // .select('title price')
            // .populate('userId' , 'name')
        })
        .then(products => {
            res.render('shop/index', {
                products: products,
                pageTitle: 'shop',
                path: "/",
                currentPage: page,
                totalProducts: totalItems,
                hasNextPage: ITEM_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEM_PER_PAGE)
            })
        })
        .catch(err => {
            const error = new Error(err)
            error.statusCode = 500;
            return next(error)
        });
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
        }).catch(err => {
        const error = new Error(err)
        error.statusCode = 500;
        return next(error)
    });
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
        }).catch(err => {
        console.log(err)
        const error = new Error(err)
        error.statusCode = 500;
        return next(error)
    });
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
            const error = new Error(err)
            error.statusCode = 500;
            return next(error)
        });
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
        .catch(err => {
            const error = new Error(err)
            error.statusCode = 500;
            return next(error)
        });

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
        .catch(err => {
            const error = new Error(err)
            error.statusCode = 500;
            return next(error)
        });

}

exports.getInvoice = (req, res, next) => {
    const {orderId} = req.params;
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('No order found!'))
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized'))
            }
            const invoiceName = `invoice-${orderId}.pdf`;
            const invoicePath = path.join('data', 'invoices', invoiceName);

            const pdfDoc = new PDFDocument();
            res.setHeader('Content-type', 'application/pdf')
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')

            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);

            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            });
            pdfDoc.text('-----------------------');
            let totalPrice = 0;
            order.products.forEach(prod => {
                totalPrice += prod.quantity * prod.product.price;
                pdfDoc
                    .fontSize(14)
                    .text(
                        prod.product.title +
                        ' - ' +
                        prod.quantity +
                        ' x ' +
                        '$' +
                        prod.product.price
                    );
            });
            pdfDoc.text('---');
            pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

            pdfDoc.end();
            // use Steam better , big file
            // const file = fs.createReadStream(invoicePath)
            // res.setHeader('Content-type', 'application/pdf')
            // res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')
            // file.pipe(res);
            // fs.readFile(invoicePath, (err, data) => {
            //     if (err) {
            //         return next(err)
            //     }
            //     res.setHeader('Content-type', 'application/pdf')
            //     res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"')
            //     res.send(data);
            // })
        })

}

exports.getCheckout = (req, res, next) => {
    let products;
    let total = 0;
    req.user
        .populate('cart.items.productId')
        // .execPopulate()
        .then(user => {
            products = user.cart.items;
            total = 0;

            products.forEach(p => {
                total += p.quantity * p.productId.price
            })

            return stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: products.map(p => {
                    return {
                        price_data: {
                            product_data: {
                                name: p.productId.title,
                                description: p.productId.description,
                            },
                            unit_amount: p.productId.price * 100,
                            currency: 'usd',

                        },
                        quantity: p.quantity
                    };
                }),
                mode: 'payment',
                success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
                cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
            })
        }).then(session => {
        res.render('shop/checkout', {
            pageTitle: 'Checkout',
            path: "/checkout",
            products,
            totalSum: total,
            sessionId: session.id
        })
    })
        .catch(err => {
            const error = new Error(err)
            error.statusCode = 500;
            return next(error)
        })
}

exports.getCheckoutSuccess = (req, res, next) => {
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
        .catch(err => {
            const error = new Error(err)
            error.statusCode = 500;
            return next(error)
        });
}