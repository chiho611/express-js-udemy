const path = require("path");
const fs = require('fs')
const e = require("express");
const dataPath = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');


module.exports = class Cart {
    static addProduct = (productId, productPrice) => {
        fs.readFile(dataPath, (err, fileData) => {
            let cart = {products: [], totalPrice: 0}
            if (!err && fileData.length > 0) {
                cart = JSON.parse(fileData);
            }

            const existingProductIndex = cart.products.findIndex(product => product.id === productId)
            const existingProduct = cart.products[existingProductIndex]
            let updatedProduct
            if (existingProduct) {
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                // cart.products = [...cart.products]
                cart.products[existingProductIndex] = updatedProduct
            } else {
                updatedProduct = {id: productId, qty: 1}
                cart.products = [...cart.products, updatedProduct]

            }
            cart.totalPrice += +productPrice
            fs.writeFile(dataPath, JSON.stringify(cart), err => console.log(err))
        })
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(dataPath, (err, fileData) => {
            if (err) {
                return;
            }
            const updatedCart = {...JSON.parse(fileData)}
            const product = updatedCart.products.find(product => product.id === id);
            if (!product) {
                return;
            }
            const productQty = product.qty;

            updatedCart.products = updatedCart.products.filter(product => product.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - (productPrice * productQty);

            fs.writeFile(dataPath, JSON.stringify(updatedCart), err => console.log(err))
        });
    }

    static getCart(callback) {
        fs.readFile(dataPath, (err, fileDate) => {
            const cart = JSON.parse(fileDate);
            if (err) {
                callback(null);
            } else {
                callback(cart);
            }

        })
    }

}