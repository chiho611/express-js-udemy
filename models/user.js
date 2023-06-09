const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    // name: {
    //     type: String, require: true
    // },
    email: {
        type: String, require: true
    },
    resetToken : String,
    resetTokenExpiration: Date,
    password: {
        type: String, require: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId, ref: 'Product', require: true
            }, quantity: {
                type: Number, require: true
            }
        }]
    }
})

userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(cartProduct => {
        return cartProduct.productId.toString() === product._id.toString();
    })
    let updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        updatedCartItems[cartProductIndex].quantity += 1
    } else {
        updatedCartItems.push({productId: product._id, quantity: 1})
    }
    const updatedCart = {items: updatedCartItems}
    this.cart = updatedCart
    return this.save();

}

userSchema.methods.deleteItemsFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString()
    })
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart.items = [];
    return this.save();
}

module.exports = mongoose.model('User', userSchema)