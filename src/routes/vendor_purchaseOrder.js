var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var db = require('./database.js');
var csrfProtection = csrf();
router.use(csrfProtection);

/*purchase analysis -- analysis */
router.get('/analysis', (req, res, next) => {
    req.flash('message1', 'Please Login First');
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
        res.locals.type = req.session.type;
    }
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
        req.session.type = req.cookies.type;
    }
    if (!req.cookies.islogin || !req.session.islogin) {
        var message1 = req.flash('message1');
        res.render('users/login', {csrfToken: req.csrfToken(), message: message1});
    } else if (req.session.type === 'customer') {
        res.redirect('/products');
    }
    else {
        var user = res.locals.islogin;
        var measure = req.query.measure;
        var period = req.query.period;
        var type = res.locals.type;
        var con = db.connect((err) => {
            if (err) throw err;
        });
        if (measure !== undefined && period !== undefined && measure === 'amount') {
            con.query('SELECT s.sp_id, s.brand, SUM(p.subtotal) AS total, s.name\n' +
                'FROM po_details p, smartphone s, purchaseorder o\n' +
                'WHERE p.sp_id = s.sp_id and p.po_no = o.po_no and ' +
                'datediff(NOW(), o.date) < ? and o.status = \'shipped\'\n' +
                'group by s.sp_id\n' +
                'ORDER BY TOTAL desc;', [period], (err, result) => {
                if (err) throw err;
                res.render('orders/analysis', {
                    csrfToken: req.csrfToken(),
                    period: period,
                    analysisResult: result,
                    login: user,
                    type: type
                });
                con.end();
            });
        } else if (measure !== undefined && period !== undefined && measure === 'quantity') {
            con.query('SELECT s.sp_id, s.brand, SUM(p.po_quantity) AS total, s.name\n' +
                'FROM po_details p, smartphone s, purchaseorder o\n' +
                'WHERE p.sp_id = s.sp_id and p.po_no = o.po_no and ' +
                'datediff(NOW(), o.date) < ? and o.status = \'shipped\'\n' +
                'group by s.sp_id\n' +
                'ORDER BY TOTAL desc;', [period], (err, result) => {
                if (err) throw err;
                res.render('orders/analysis', {
                    csrfToken: req.csrfToken(),
                    period: period,
                    analysisResult: result,
                    login: user,
                    type: type
                });
                con.end();
            });
        } else {
            con.query('SELECT s.sp_id, s.brand, SUM(p.subtotal) AS total, s.name\n' +
                'FROM po_details p, smartphone s, purchaseorder o\n' +
                'WHERE p.sp_id = s.sp_id and p.po_no = o.po_no and ' +
                'datediff(NOW(), o.date) < 30 and o.status = \'shipped\'\n' +
                'group by s.sp_id\n' +
                'ORDER BY TOTAL desc;', (err, result) => {
                if (err) throw err;
                res.render('orders/analysis', {
                    csrfToken: req.csrfToken(),
                    analysisResult: result,
                    login: user,
                    type: type
                });
                con.end();
            });
        }
    }
});

/*change price */
router.get('/changeprice', (req, res, next) => {
    req.flash('message1', 'Please Login First');
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
        res.locals.type = req.session.type;
    }
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
        req.session.type = req.cookies.type;
    }
    if (!req.cookies.islogin || !req.session.islogin) {
        var message1 = req.flash('message1');
        res.render('users/login', {csrfToken: req.csrfToken(), message: message1});
    }
    else if (req.session.type === 'customer') {
        res.redirect('/products');
    }
    else {
        var id = req.query.id;
        var price = req.query.price;
        var con = db.connect((err) => {
            if (err) throw err;
        });
        con.query('UPDATE tonymall.smartphone\n' +
            'SET currentPrice = ?' +
            'WHERE sp_id=?;', [price, id], (err, result) => {
            if (err) throw err;
            con.end();
        });
        res.redirect(`/products/detail/${id}`);
    }
});

/*purchase detail -- pending */
router.get('/pending', (req, res, next) => {
    req.flash('message1', 'Please Login First');
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
        res.locals.type = req.session.type;
    }
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
        req.session.type = req.cookies.type;
    }
    if (!req.cookies.islogin || !req.session.islogin) {
        var message1 = req.flash('message1');
        res.render('users/login', {csrfToken: req.csrfToken(), message: message1});
    }
    else if (req.session.type === 'customer') {
        res.redirect('/products');
    }
    else {
        var user = res.locals.islogin;
        var type = res.locals.type;
        var con = db.connect((err) => {
            if (err) throw err;
        });
        con.query('SELECT purchaseorder.po_no, purchaseorder.date, purchaseorder.po_amount, purchaseorder.status, DATE_FORMAT(purchaseorder.date,\'%Y-%m-%d %H:%i:%s\') As date, user.fullname FROM tonymall.purchaseorder, tonymall.user WHERE tonymall.purchaseorder.user_id = tonymall.user.user_id AND status=? ORDER BY date DESC', ['pending'], (err, result) => {
            if (err) throw err;
            res.render('orders/vendor_order', {
                csrfToken: req.csrfToken(),
                order_package_list: result,
                login: user,
                type: type
            });
            con.end();
        });
    }
});

/*purchase detail -- hold */
router.get('/hold', (req, res, next) => {
    req.flash('message1', 'Please Login First');
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
        res.locals.type = req.session.type;
    }
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
        req.session.type = req.cookies.type;
    }
    if (!req.cookies.islogin || !req.session.islogin) {
        var message1 = req.flash('message1');
        res.render('users/login', {csrfToken: req.csrfToken(), message: message1});
    }
    else if (req.session.type === 'customer') {
        res.redirect('/products');
    }
    else {
        var user = res.locals.islogin;
        var type = res.locals.type;
        var con = db.connect((err) => {
            if (err) throw err;
        });
        con.query('SELECT purchaseorder.po_no, purchaseorder.date, purchaseorder.po_amount, purchaseorder.status, DATE_FORMAT(purchaseorder.date,\'%Y-%m-%d %H:%i:%s\') As date, user.fullname FROM tonymall.purchaseorder, tonymall.user WHERE tonymall.purchaseorder.user_id = tonymall.user.user_id AND status=? ORDER BY date DESC', ['hold'], (err, result) => {
            if (err) throw err;
            res.render('orders/vendor_order', {
                csrfToken: req.csrfToken(),
                order_package_list: result,
                login: user,
                type: type
            });
            con.end();
        });
    }
});

/*purchase detail -- past */
router.get('/past', (req, res, next) => {
    req.flash('message1', 'Please Login First');
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
        res.locals.type = req.session.type;
    }
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
        req.session.type = req.cookies.type;
    }
    if (!req.cookies.islogin || !req.session.islogin) {
        var message1 = req.flash('message1');
        res.render('users/login', {csrfToken: req.csrfToken(), message: message1});
    }
    else if (req.session.type === 'customer') {
        res.redirect('/products');
    }
    else {
        var user = res.locals.islogin;
        var type = res.locals.type;
        var con = db.connect((err) => {
            if (err) throw err;
        });
        con.query('SELECT purchaseorder.po_no, purchaseorder.date, purchaseorder.po_amount, purchaseorder.status, DATE_FORMAT(purchaseorder.date,\'%Y-%m-%d %H:%i:%s\') As date, user.fullname FROM tonymall.purchaseorder, tonymall.user WHERE (status=? OR status=?) AND tonymall.purchaseorder.user_id = tonymall.user.user_id ORDER BY date DESC', ['shipped', 'cancelled'], (err, result) => {
            if (err) throw err;
            res.render('orders/vendor_order', {
                csrfToken: req.csrfToken(),
                order_package_list: result,
                login: user,
                type: type
            });
            con.end();
        });
    }
});

/*ship product */
router.get('/ship/:num', (req, res, next) => {
    req.flash('message1', 'Please Login First');
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
        res.locals.type = req.session.type;
    }
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
        req.session.type = req.cookies.type;
    }
    if (!req.cookies.islogin || !req.session.islogin) {
        var message1 = req.flash('message1');
        res.render('users/login', {csrfToken: req.csrfToken(), message: message1});
    }
    else if (req.session.type === 'customer') {
        res.redirect('/products');
    }
    else {
        var num = parseInt(req.params.num);
        var con = db.connect((err) => {
            if (err) throw err;
        });
        con.query('UPDATE tonymall.purchaseorder\n' +
            'SET status = \'shipped\',  status_date = NOW()\n' +
            'WHERE po_no=?;', [num], (err, result) => {
            if (err) throw err;
            con.end();
        });

        res.redirect(`/vendor/order/${num}`);
    }
});


/*cancel product */
router.get('/cancel/:num', (req, res, next) => {
    req.flash('message1', 'Please Login First');
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
        res.locals.type = req.session.type;
    }
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
        req.session.type = req.cookies.type;
    }
    if (!req.cookies.islogin || !req.session.islogin) {
        var message1 = req.flash('message1');
        res.render('users/login', {csrfToken: req.csrfToken(), message: message1});
    }
    else if (req.session.type === 'customer') {
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
        res.redirect(`/vendor/order/${num}`);
    }
});

/*hold product */
router.get('/hold/:num', (req, res, next) => {
    req.flash('message1', 'Please Login First');
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
        res.locals.type = req.session.type;
    }
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
        req.session.type = req.cookies.type;
    }
    if (!req.cookies.islogin || !req.session.islogin) {
        var message1 = req.flash('message1');
        res.render('users/login', {csrfToken: req.csrfToken(), message: message1});
    }
    else if (req.session.type === 'customer') {
        res.redirect('/products');
    }
    else {
        var num = parseInt(req.params.num);
        var con = db.connect((err) => {
            if (err) throw err;
        });
        con.query('UPDATE tonymall.purchaseorder\n' +
            'SET status = \'hold\',  status_date = NOW()\n' +
            'WHERE po_no=?;', [num], (err, result) => {
            if (err) throw err;
            con.end();
        });
        res.redirect(`/vendor/order/${num}`);
    }
});

/*purchase detail -- particular order */
router.get('/:num', (req, res, next) => {
    var query1;
    var num = parseInt(req.params.num);
    req.flash('message1', 'Please Login First');
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
        res.locals.type = req.session.type;
    }
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
        req.session.type = req.cookies.type;
    }
    if (!req.cookies.islogin || !req.session.islogin) {
        var message1 = req.flash('message1');
        res.render('users/login', {csrfToken: req.csrfToken(), message: message1});
    }
    else if (req.session.type === 'customer') {
        res.redirect('/products');
    }
    else {
        var user = res.locals.islogin;
        var type = res.locals.type;
        var con = db.connect((err) => {
            if (err) throw err;
        });
        con.query('SELECT purchaseorder.po_no, DATE_FORMAT(purchaseorder.status_date,\'%Y-%m-%d %H:%i:%s\') As status_date, DATE_FORMAT(purchaseorder.date, \'%Y-%m-%d %H:%i:%s\') As date, user.fullname, purchaseorder.po_amount, purchaseorder.status, purchaseorder.cancelled_by, user.shipping_address\n' +
            'FROM purchaseorder, user\n' +
            'WHERE purchaseorder.po_no =? AND\n' +
            'purchaseorder.user_id = user.user_id;', [num], (err, result) => {
            if (err) throw err;
            query1 = result;
        });
        con.query('SELECT smartphone.name, po_details.po_quantity, po_details.po_price, po_details.subtotal\n' +
            'FROM smartphone, po_details, purchaseorder\n' +
            'WHERE smartphone.sp_id = po_details.sp_id AND\n' +
            'purchaseorder.po_no = po_details.po_no AND\n' +
            'purchaseorder.po_no =?;', [num], (err_product, result_product) => {
            if (err_product) throw err_product;
            res.render('orders/vendor_detail', {
                csrfToken: req.csrfToken(),
                order_detail: query1,
                order_detail_product: result_product,
                login: user,
                type: type
            });
            con.end();
        });
    }
});

/*order page */
router.get('/', (req, res, next) => {
    req.flash('message1', 'Please Login First');
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
        res.locals.type = req.session.type;
    }
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
        req.session.type = req.cookies.type;
    }
    if (!req.cookies.islogin || !req.session.islogin) {
        var message1 = req.flash('message1');
        res.render('users/login', {csrfToken: req.csrfToken(), message: message1});
    }
    else if (req.session.type === 'customer') {
        res.redirect('/products');
    }
    else {
        var user = res.locals.islogin;
        var type = res.locals.type;
        var con = db.connect((err) => {
            if (err) throw err;
        });
        con.query('SELECT purchaseorder.po_no, purchaseorder.date, purchaseorder.po_amount, purchaseorder.status, DATE_FORMAT(purchaseorder.date,\'%Y-%m-%d %H:%i:%s\') As date, user.fullname FROM tonymall.purchaseorder, tonymall.user WHERE tonymall.purchaseorder.user_id = tonymall.user.user_id ORDER BY date DESC', (err, result) => {
            if (err) throw err;
            res.render('orders/vendor_order', {
                csrfToken: req.csrfToken(),
                order_package_list: result,
                login: user,
                type: type
            });
            con.end();
        });
    }
});

module.exports = router;

