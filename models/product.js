const path = require("path");
const fs = require('fs')
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
    constructor(title) {
        this.title = title
    }

    save() {
        getProductFromFile(products => {
            products.push(this)
            fs.writeFile(dataPath, JSON.stringify(products), err => {
                console.log(err)
            })
        })
    }

    static fetchAll(callback) {
        getProductFromFile(callback)
    }
}