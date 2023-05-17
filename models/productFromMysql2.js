const db = require("../util/database")

module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title
        this.imageUrl = imageUrl
        this.price = price
        this.description = description
    }

    save() {
        return db.execute("INSERT INTO products (title , price,imageUrl, description) VALUES (?,?,?,?)",
            [this.title, this.price, this.imageUrl, this.description])
    }

    static fetchAll() {
        return db.execute("SELECT * from products");
    }

    static findById(productId) {
        return db.execute("SELECT * FROM products WHERE id = ?", [productId])
    }

    static deleteById(productId) {
    }
}