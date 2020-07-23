var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var db = require('./database.js');
var flash = require('connect-flash');
var csrfProtection = csrf();
router.use(csrfProtection);

/* sign up */
router.get('/signup', function (req, res, next) {
    req.session.redirectTo = '/';
    res.render('users/signup', {csrfToken: req.csrfToken()});
});

/* sign up post */
router.post('/signup', function (req, res, next) {
    var user = req.body.user;
    var fullname = req.body.fullname;
    var email = req.body.email_address;
    var shipping_address = req.body.shipping_address;
    var password = req.body.password_sign;
    var con = db.connect((err) => {
        if (err) throw err;
    });
    con.query('INSERT into user(user_id, fullname, email_address, shipping_address,password) value(?,?,?,?,?)', [user, fullname, email, shipping_address, password], function (err, result, next) {
        if (err) {
            console.log("error:" + err.message);
            return next(err);
        }
        req.session.type = 'customer';
        req.session.islogin = user;
        res.locals.type = req.session.type;
        res.locals.islogin = req.session.islogin;
        res.cookie('islogin', res.locals.islogin, {maxAge: 3600 * 1000});
        res.cookie('type', res.locals.type, {maxAge: 3600 * 1000});
        var redirectTo = res.locals.redirectTo ? res.locals.redirectTo : '/';
        delete req.session.redirectTo;
        res.clearCookie('redirectTo');
        res.redirect(redirectTo);
        con.end();
    });


});

/* login page */
router.get('/login', function (req, res, next) {
    res.render('users/login', {csrfToken: req.csrfToken()});
});

/* login post */
router.post('/login', function (req, res, next) {
    req.flash('message1', 'Incorrect user id or password');
    var username = req.body.username;
    var con = db.connect((err) => {
        if (err) throw err;
    });
    con.query('SELECT type, password FROM user WHERE user_id=?', [username], (err, result) => {
        if (err) throw err;
        if (result[0] === undefined) {
            var message1 = req.flash('message1');
            res.render('users/login', {csrfToken: req.csrfToken(), message: message1});
        } else {
            if (result[0].password === req.body.password) {
                req.session.type = result[0].type;
                req.session.islogin = req.body.username;
                res.locals.type = req.session.type;
                res.locals.islogin = req.session.islogin;
                res.cookie('islogin', res.locals.islogin, {maxAge: 3600 * 1000});
                res.cookie('type', res.locals.type, {maxAge: 3600 * 1000});
                var redirectTo = (req.session.redirectTo && res.locals.type === 'customer') ? req.session.redirectTo : '/';
                delete req.session.redirectTo;
                res.clearCookie('redirectTo');
                res.redirect(redirectTo);
            } else {
                var message2 = req.flash('message1');
                res.render('users/login', {csrfToken: req.csrfToken(), message: message2});
            }
        }
        con.end();
    });


});

/* logout */
router.get('/logout', function (req, res, next) {
    res.clearCookie('islogin');
    res.clearCookie('type');
    req.session.destroy();
    res.redirect('/');
});

router.get('/', function (req, res, next) {
    res.redirect('http://localhost:3000');
});

module.exports = router;

