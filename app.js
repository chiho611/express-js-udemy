const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const authRouter = require("./routes/auth");
const path = require("path");
// const expressHbs = require('express-handlebars');
const {get404, get500} = require("./controllers/error");
const {mongooseConnect} = require('./util/database');
const User = require('./models/user');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const mongoose = require("mongoose");
const flash = require("connect-flash");
const csrfProtection = csrf();

app.use(express.static(path.join(__dirname, 'public')));
const MONGODB_URI =
    'mongodb+srv://chiho:k3DNW706u9lIcABX@cluster0.swnckh2.mongodb.net/shop';

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.use(session({secret: 'my secret', saveUninitialized: false, resave: false, store: store}))

app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            throw new Error(err)
        })
    // next();
})

// app.engine("hbs", expressHbs({layoutsDir: 'views/layouts', defaultLayout: 'main-layout', extname: 'hbs'}));
// app.set("view engine", 'hbs');
app.set("view engine", 'ejs');
// app.set("view engine", 'pug');
// app.set("views", 'views'); default views folder

app.use(bodyParser.urlencoded({extended: false}));

app.use(csrfProtection)
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);

app.get('/500', get500)
app.use(get404)
app.use((error, req, res, next) => {
    res.redirect('/500');
})
mongoose.connect(MONGODB_URI)
    .then(result => {
        app.listen(3000, function () {
            console.log("info", 'Server is running at port : ' + 3000);
        });
    })
    .catch(err => {
        console.log(err);
    });
