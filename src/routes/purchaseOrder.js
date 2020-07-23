var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var db = require('./database.js');
var csrfProtection = csrf();
router.use(csrfProtection);

/*purchase detail -- current */
router.get('/current', (req, res, next) => {
    req.flash('message1', 'Please Login First');
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
    }
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (!req.cookies.islogin || !req.session.islogin) {
        var message1 = req.flash('message1');
        res.render('users/login', {csrfToken: req.csrfToken(), message: message1});
    } else if (req.session.type === 'vendor') {
        res.redirect('/products');
    }
    else {
        var user = res.locals.islogin;
        var con = db.connect((err) => {
            if (err) throw err;
        });
        con.query('SELECT po_no, date, po_amount, status, DATE_FORMAT(date,\'%Y-%m-%d %H:%i:%s\') As date, user_id FROM tonymall.purchaseorder WHERE user_id =? AND (status=? OR status=?) ORDER BY date DESC', [user, 'pending', 'hold'], (err, result) => {
            if (err) throw err;
            res.render('orders/order', {csrfToken: req.csrfToken(), order_package_list: result, login: user});
            con.end();
        });
    }
});

/*purchase detail -- past */
router.get('/past', (req, res, next) => {
    req.flash('message1', 'Please Login First');
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
    }
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (!req.cookies.islogin || !req.session.islogin) {
        var message1 = req.flash('message1');
        res.render('users/login', {csrfToken: req.csrfToken(), message: message1});
    }
    else if (req.session.type === 'vendor') {
        res.redirect('/products');
    }
    else {
        var user = res.locals.islogin;
        var con = db.connect((err) => {
            if (err) throw err;
        });
        con.query('SELECT po_no, date, po_amount, status, DATE_FORMAT(date,\'%Y-%m-%d %H:%i:%s\') As date, user_id FROM tonymall.purchaseorder WHERE user_id =? AND (status=? OR status=?) ORDER BY date DESC', [user, 'shipped', 'cancelled'], (err, result) => {
            if (err) throw err;
            res.render('orders/order', {
                csrfToken: req.csrfToken(),
                order_package_list: result,
                login: user
            });
            con.end();
        });
    }
});

/*cancel pending or hold product */
router.get('/cancel/:num', (req, res, next) => {
    req.flash('message1', 'Please Login First');
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
    }
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (!req.cookies.islogin || !req.session.islogin) {
        var message1 = req.flash('message1');
        res.render('users/login', {csrfToken: req.csrfToken(), message: message1});
    }
    else if (req.session.type === 'vendor') {
        res.redirect('/products');
    }
    else {
        var user = res.locals.islogin;
        var num = parseInt(req.params.num);
        var con = db.connect((err) => {
            if (err) throw err;
        });
        con.query('UPDATE tonymall.purchaseorder\n' +
            'SET status = \'cancelled\',  status_date = NOW(), cancelled_by=?\n' +
            'WHERE po_no=?;', [user, num], (err, result) => {
            if (err) throw err;
            con.end();
        });
        res.redirect(`/order/${num}`);
    }
});

/*purchase detail -- particular order */
router.get('/:num', (req, res, next) => {
    req.flash('message1', 'Please Login First');
    var query1;
    var num = parseInt(req.params.num);
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
    }
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (!req.cookies.islogin || !req.session.islogin) {
        var message1 = req.flash('message1');
        res.render('users/login', {csrfToken: req.csrfToken(), message: message1});
    }
    else if (req.session.type === 'vendor') {
        res.redirect('/products');
    }
    else {
        var user = res.locals.islogin;
        var con = db.connect((err) => {
            if (err) throw err;
        });
        con.query('SELECT purchaseorder.po_no, DATE_FORMAT(purchaseorder.status_date,\'%Y-%m-%d %H:%i:%s\') As status_date, DATE_FORMAT(purchaseorder.date, \'%Y-%m-%d %H:%i:%s\') As date, user.fullname, purchaseorder.cancelled_by, purchaseorder.po_amount, purchaseorder.status, user.shipping_address\n' +
            'FROM purchaseorder, user\n' +
            'WHERE purchaseorder.user_id =? AND\n' +
            'purchaseorder.po_no =? AND\n' +
            'purchaseorder.user_id = user.user_id;', [user, num], (err, result) => {
            if (err) throw err;
            query1 = result;
        });
        con.query('SELECT smartphone.name, rating.rates, po_details.po_no, po_details.sp_id, po_details.po_quantity,' +
            'po_details.po_price, purchaseorder.status, po_details.subtotal FROM po_details\n' +
            'JOIN smartphone ON smartphone.sp_id = po_details.sp_id\n' +
            'JOIN purchaseorder ON purchaseorder.po_no = po_details.po_no\n' +
            'AND purchaseorder.user_id =? AND purchaseorder.po_no =?\n' +
            'left JOIN rating ON rating.po_no = po_details.po_no and rating.sp_id = po_details.sp_id;', [user, num], (errProduct, resultProduct) => {
            if (errProduct) throw errProduct;
            res.render('orders/detailOrder', {
                csrfToken: req.csrfToken(),
                order_detail: query1,
                orderDetailProduct: resultProduct,
                login: user
            });
            con.end();
        });
    }
});

/*rating*/
router.post('/:num', (req, res, next) => {
    req.flash('message1', 'Please Login First');
    var query1;
    var num = parseInt(req.params.num);
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
    }
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (!req.cookies.islogin || !req.session.islogin) {
        var message1 = req.flash('message1');
        res.render('users/login', {csrfToken: req.csrfToken(), message: message1});
    }
    else if (req.session.type === 'vendor') {
        res.redirect('/products');
    }
    else {
        var num = parseInt(req.params.num);
        var sp_id = req.body.sp_id;
        var po_no = req.body.po_no;
        var rates = req.body.rateNo;
        var comment = req.body.message;
        var con = db.connect((err) => {
            if (err) throw err;
        });
        let queries = 'INSERT INTO rating (sp_id, po_no, rates, reviews) value(?, ?, ?, ?); SELECT avg(rates) as average, COUNT(*) AS totalNumberOfRatings FROM rating WHERE sp_id = ?; UPDATE smartphone SET starRating = (SELECT round(avg(rates), 1) FROM rating WHERE sp_id = ?) WHERE sp_id = ?';
        con.query(queries, [sp_id, po_no, rates, comment, sp_id, sp_id, sp_id], (err) => {
            if (err) throw err;
            con.end();
        });

        res.redirect(`/order/${num}`);
    }
});

/*order page */
router.get('/', (req, res, next) => {
    req.flash('message1', 'Please Login First');
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
    }
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (!req.cookies.islogin || !req.session.islogin) {
        var message1 = req.flash('message1');
        res.render('users/login', {csrfToken: req.csrfToken(), message: message1});
    }
    else if (req.session.type === 'vendor') {
        res.redirect('/products');
    }
    else {
        var user = res.locals.islogin;
        var con = db.connect((err) => {
            if (err) throw err;
        });
        con.query('SELECT po_no, date, po_amount, status, DATE_FORMAT(date,\'%Y-%m-%d %H:%i:%s\') As date, user_id, cancelled_by FROM tonymall.purchaseorder WHERE user_id =? ORDER BY date DESC', [user], (err, result) => {
            if (err) throw err;
            res.render('orders/order', {
                csrfToken: req.csrfToken(),
                order_package_list: result,
                login: user
            });
            con.end();
        });
    }
});

module.exports = router;
