const Product = require('../models/product')
const Order = require('../models/order')
const path = require("path");
const fs = require('fs');
const PDFDocument = require('pdfkit');

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

exports.getCheckout = (req, res, next) => {
    res.render('shop/index', {
        pageTitle: 'Checkout',
        path: "/checkout"
    })
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