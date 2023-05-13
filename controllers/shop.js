const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getAllProduct = (req, res, next) => {
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

exports.getProduct = (req, res, next) => {
    const {productId} = req.params;
    Product.findById(productId, product => {
        res.render('shop/product-detail', {
            product,
            pageTitle: 'product detail',
            path: "/products"
        })
    })
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