const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const authRouter = require("./routes/auth");
const path = require("path");
// const expressHbs = require('express-handlebars');
const {get404} = require("./controllers/error");
const {mongooseConnect} = require('./util/database');
const User = require('./models/user');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

app.use(express.static(path.join(__dirname, 'public')));
const store = new MongoDBStore({
    uri: 'mongodb+srv://chiho:k3DNW706u9lIcABX@cluster0.swnckh2.mongodb.net/shop',
    collection: 'sessions'
});

app.use(session({secret: 'my secret', saveUninitialized: false, resave: false, store: store}))
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err)
        })
    // next();
})

// app.engine("hbs", expressHbs({layoutsDir: 'views/layouts', defaultLayout: 'main-layout', extname: 'hbs'}));
// app.set("view engine", 'hbs');
app.set("view engine", 'ejs');
// app.set("view engine", 'pug');
// app.set("views", 'views'); default views folder

app.use(bodyParser.urlencoded({extended: false}));

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);

app.use(get404)

mongooseConnect()
    .then(result => {

        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'alvin',
                    email: 'test@test.com',
                    cart: {items: []}
                })
                user.save();
            }
        })

        app.listen(3000, function () {
            console.log("info", 'Server is running at port : ' + 3000);
        });
    })
    .catch(err => {
        console.log(err)
    })
;
