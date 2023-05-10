exports.getAddProduct = (req, res, next) => {
    res.render("add-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        productCSS: true,
        formsCSS: true,
        activeAddProduct: true
    })
}

const products = [];

exports.postAddProduct = (req, res, next) => {
    products.push({title: req.body.title})
    res.redirect('/');
}

exports.getProduct = (req, res, next) => {
    res.render('shop',
        {
            prods: products,
            pageTitle: 'shop',
            path: "/",
            hasProduct: products.length > 0,
            productCSS: true,
            activeShop: true
        }
    )
}