const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const adminRouter = require("./routes/admin").router;
const shopRouter = require("./routes/shop");
const path = require("path");

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", 'pug');
// app.set("views", 'views');

app.use(bodyParser.urlencoded({extended: false}));

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use((req, res, next) => {
    res.status(404).render('404' , {pageTitle : "Page Not Found"})
})

app.listen(3000, function () {
    console.log("info", 'Server is running at port : ' + 3000);
});