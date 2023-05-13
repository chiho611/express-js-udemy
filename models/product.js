const path = require("path");
const fs = require('fs')
const {deleteProduct} = require("./cart");
const dataPath = path.join(path.dirname(process.mainModule.filename), 'data', 'product.json');

const getProductFromFile = (callback) => {
    fs.readFile(dataPath, (err, data) => {
        if (err || !data.length) {
            callback([])
        } else {
            callback(JSON.parse(data))
        }
    })
}

module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title
        this.imageUrl = imageUrl
        this.price = price
        this.description = description
    }

    save() {
        getProductFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(
                    product =>
                        product.id === this.id
                );
                const updatedProduct = [...products];
                updatedProduct[existingProductIndex] = this;
                fs.writeFile(dataPath, JSON.stringify(updatedProduct), err => {
                    console.log(err)
                })
            } else {
                this.id = Math.random().toString();
                products.push(this)
                fs.writeFile(dataPath, JSON.stringify(products), err => {
                    console.log(err)
                })
            }
        })
    }

    static fetchAll(callback) {
        getProductFromFile(callback)
    }

    static findById(productId, callback) {
        getProductFromFile(products => {
            const product = products.find(p => p.id === productId)
            callback(product)
        })
    }

    static deleteById(productId) {
        getProductFromFile(products => {
            const product = products.find(product => product.id === productId)
            const updatedProducts = products.filter(p => p.id !== productId)
            fs.writeFile(dataPath, JSON.stringify(updatedProducts), err => {
                if (!err) {
                }
                deleteProduct(productId, product.price)
            })
        })
    }
}