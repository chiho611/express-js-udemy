const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const adminRouter = require("./routes/admin").router;
const shopRouter = require("./routes/shop");
const path = require("path");
// const expressHbs = require('express-handlebars');
const {get404} = require("./controllers/error");
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err)
        })
})

// app.engine("hbs", expressHbs({layoutsDir: 'views/layouts', defaultLayout: 'main-layout', extname: 'hbs'}));
// app.set("view engine", 'hbs');
app.set("view engine", 'ejs');
// app.set("view engine", 'pug');
// app.set("views", 'views'); default views folder

app.use(bodyParser.urlencoded({extended: false}));

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(get404)

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);

Cart.belongsTo(User);
User.hasOne(Cart);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});


Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});

sequelize
    .sync()
    // .sync({force: true}) // //Recreate table anytime , don't use on production
    .then(result => {
        return User.findByPk(1);
        // console.log(result)
    }).then(user => {
    if (!user) {
        return User.create({
            name: 'alvin',
            email: 'test@test.com'
        })
    }
    return user;
}).then(user => {
    user.getCart().then(cart => {
        if (!cart) {
            user.createCart();
        }
    }).catch(err => console.log(err))

}).then(cart => {
    app.listen(3000, function () {
        console.log("info", 'Server is running at port : ' + 3000);
    });
}).catch(err =>
    console.log(err)
)
