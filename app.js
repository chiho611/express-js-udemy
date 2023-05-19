const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const path = require("path");
// const expressHbs = require('express-handlebars');
const {get404} = require("./controllers/error");
const {mongoConnect} = require('./util/database');

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     })
    next();
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

mongoConnect(() => {
    app.listen(3000, function () {
        console.log("info", 'Server is running at port : ' + 3000);
    });
})
