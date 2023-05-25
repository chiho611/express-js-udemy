const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    console.log(req.session.isLoggedIn)
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
    User.findById("646ef179f52c7f650fbaa37e")
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user
            req.session.save(err => {
                res.redirect('/')
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postLogout = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
    req.session.destroy(err => {
        // console.log(err)
        res.redirect('/')
    });
}