const {getDb} = require('../util/database')
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart; //{item:[]}
        this._id = id
    }

    save() {
        return getDb().collection('users').insertOne(this);
    }

    addToCart(product) {
        if (this.cart) {
            const cartProductIndex = this.cart.items.findIndex(cartProduct => {
                return cartProduct.productId.toString() === product._id.toString();
            })

            let updatedCartItems = [...this.cart.items];

            if (cartProductIndex >= 0) {
                updatedCartItems[cartProductIndex].quantity += 1
            } else {
                updatedCartItems.push({productId: new ObjectId(product._id), quantity: 1})
            }
            const updatedCart = {items: updatedCartItems}
            return getDb().collection('users')
                .updateOne({_id: new ObjectId(this._id)}, {$set: {cart: updatedCart}})
        } else {
            return getDb().collection('users')
                .updateOne({_id: new ObjectId(this._id)}, {
                    $set: {
                        cart: {
                            items: [{
                                productId: new ObjectId(product._id), quantity: 1
                            }]
                        }
                    }
                })
        }
    }

    deleteItemsFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString()
        })

        return getDb().collection('users')
            .updateOne({_id: new ObjectId(this._id)}, {
                $set: {
                    cart: {items: updatedCartItems}
                }
            })
    }

    getCart() {
        const productIds = this.cart.items.map(item => {
            return item.productId
        })

        return getDb().collection('products')
            .find({_id: {$in: productIds}})
            .toArray()
            .then(products => {
                return products.map(product => {
                    return {
                        ...product,
                        quantity: this.cart.items.find(item => {
                            return item.productId.toString() === product._id.toString();
                        }).quantity
                    }
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    static findById(userId) {
        return getDb().collection('users')
            .findOne({_id: new ObjectId(userId)})
            .then(user => {
                return user;
            })
            .catch(err => {
                console.log(err)
            });
    }
}


module.exports = User;
