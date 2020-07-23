var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var flash = require('connect-flash');
var db = require('./database.js');
var alert = require('alert-node');
var csrfProtection = csrf();

router.use(csrfProtection);

/*detail page*/
router.get('/detail/:id', function (req, res, next) {
    var con = db.connect((err) => {
        if (err) throw err;
    });
    con.query("SELECT smartphone.*, (smartphone.starRating)*20 as starRatingInPercent, count(rating.sp_id) as total\n" +
        "FROM smartphone \n" +
        "LEFT JOIN rating ON smartphone.sp_id = rating.sp_id  \n" +
        "WHERE smartphone.sp_id = ?;", [req.params.id], function (err, row) {
        if (err) throw err;
        con.query('SELECT r.*, p.user_id, (r.rates)*20 as ratesInPercent\n' +
            'FROM rating r, purchaseorder p\n' +
            'WHERE r.po_no = p.po_no and sp_id = ?;', [req.params.id], function (err1, reviewData) {
            if (err1) throw err1;
            var numberOfRatings = true;
            if (req.session.islogin && row[0].total > 2) {
                res.render('carts/detail', {
                    login: req.session.islogin,
                    type: req.session.type,
                    data: row,
                    reviewData: reviewData,
                    csrfToken: req.csrfToken(),
                    numberOfRatings: numberOfRatings
                });
            } else if (req.session.islogin) {
                res.render('carts/detail', {
                    login: req.session.islogin,
                    type: req.session.type,
                    data: row,
                    reviewData: reviewData,
                    csrfToken: req.csrfToken()
                });
            } else if (row[0].total > 2) {
                res.render('carts/detail', {
                    data: row,
                    reviewData: reviewData,
                    csrfToken: req.csrfToken(),
                    numberOfRatings: numberOfRatings
                });
            }
            else {
                res.render('carts/detail', {
                    data: row,
                    reviewData: reviewData,
                    csrfToken: req.csrfToken()
                });
            }
            con.end();
        });
    });
});

/*add to shopping cart*/
router.get('/AddToCart/:id', function (req, res) {
    req.flash('message1', 'Please Login First');
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
    }
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (!req.cookies.islogin || !req.session.islogin) {
        var spId = req.params.id;
        var message1 = req.flash('message1');
        req.session.redirectTo = '/products/detail/' + spId;
        res.locals.redirectTo = req.session.redirectTo;
        res.cookie('redirectTo', res.locals.redirectTo, {maxAge: 3600 * 1000});
        res.render('users/login', {csrfToken: req.csrfToken(), message: message1});
    }
    else {
        var user = res.locals.islogin;
        var con = db.connect((err) => {
            if (err) throw err;
        });
        var spId = req.params.id;
        con.query("INSERT INTO shoppingcart(user_id, sp_id, currentQuantity, subtotal) Values(?, ?, 1, (SELECT currentPrice from smartphone where sp_id=?))", [user, spId, spId], function (err) {
            if (err) {
                alert("You have already added this product to your shopping cart.");
                return;
            }
            con.end();
        });
        var url = '/products/detail/' + req.params.id;
        res.redirect(url);
    }
});

/*shopping cart*/
router.get('/ShoppingCart', function (req, res) {
    req.flash('message1', 'Please Login First');
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
    }
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (!req.cookies.islogin || !req.session.islogin) {
        var message1 = req.flash('message1');
        req.session.redirectTo = '/products/ShoppingCart';
        res.locals.redirectTo = req.session.redirectTo;
        res.cookie('redirectTo', res.locals.redirectTo, {maxAge: 3600 * 1000});
        res.render('users/login', {csrfToken: req.csrfToken(), message: message1});
    } else if (req.session.type === 'vendor') {
        res.redirect('/products');
    } else {
        var user = res.locals.islogin;
        var totalOrderAmount = 0;
        var con = db.connect((err) => {
            if (err) throw err;
        });
        con.query("SELECT smartphone.name, smartphone.currentPrice, shoppingcart.currentQuantity, shoppingcart.subtotal, shoppingcart.sp_id FROM smartphone, shoppingcart WHERE smartphone.sp_id=shoppingcart.sp_id AND shoppingcart.user_id=?", [user], function (err, result) {
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
                totalOrderAmount += result[i].subtotal;
            }
            res.render('carts/ShoppingCart', {
                csrfToken: req.csrfToken(),
                CartProduct: result,
                totalOrderAmount: totalOrderAmount,
                login: user
            });
            con.end();
        });
    }
});

/*add quantity*/
router.get('/Add/:id', function (req, res) {
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
    else {
        var user = res.locals.islogin;
        var spId = req.params.id;
        var con = db.connect((err) => {
            if (err) throw err;
        });
        con.query('UPDATE shoppingcart SET currentQuantity=(SELECT currentQuantity+1 FROM (SELECT currentQuantity FROM shoppingcart WHERE sp_id=? AND user_id=?)AS T), subtotal= (SELECT (A.currentQuantity+1)*smartphone.currentPrice FROM (SELECT * FROM shoppingcart WHERE sp_id=? AND user_id=?) A LEFT JOIN smartphone ON A.sp_id=smartphone.sp_id) WHERE sp_id=? AND user_id=?', [spId, user, spId, user, spId, user], function (err) {
            if (err) throw err;
            res.redirect('/products/ShoppingCart');
            con.end();
        });
    }
});

/*checkout*/
router.get('/checkout', function (req, res) {
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
    else {
        var user = res.locals.islogin;
        var con = db.connect((err) => {
            if (err) throw err;
        });
        var queries = "INSERT INTO purchaseorder(date, po_amount, status, user_id) Values(NOW(), (SELECT SUM(subtotal) FROM shoppingcart WHERE user_id=?), ?, ?); SELECT LAST_INSERT_ID(); INSERT INTO po_details (sp_id, po_no, po_quantity, po_price, subtotal) SELECT sp_id, LAST_INSERT_ID(), currentQuantity, subtotal DIV currentQuantity, subtotal FROM shoppingcart WHERE user_id=?; DELETE FROM shoppingcart WHERE user_id =?;";
        con.query(queries, [user, 'pending', user, user, user], function (err, result) {
            if (err) throw err;
            var num = result[0].insertId;
            res.redirect(`/order/${num}`);
            con.end();
        });
    }
});

/*reduce quantity*/
router.get('/Subtract/:id', function (req, res) {
    req.flash('message1', 'Please Login First');
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
    }
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (!req.cookies.islogin || !req.session.islogin) {
        var message1 = flash('message1');
        res.render('users/login', {csrfToken: req.csrfToken(), message: message1});
    }
    else {
        var user = res.locals.islogin;
        var spId = req.params.id;
        var con = db.connect((err) => {
            if (err) throw err;
        });
        con.query('UPDATE shoppingcart SET currentQuantity = (SELECT currentQuantity-1 FROM (SELECT currentQuantity FROM shoppingcart WHERE sp_id=? AND user_id=?)AS T), subtotal= (SELECT (A.currentQuantity-1)*smartphone.currentPrice FROM (SELECT * FROM shoppingcart WHERE sp_id=? AND user_id=?) A LEFT JOIN smartphone ON A.sp_id=smartphone.sp_id) WHERE sp_id=? AND user_id=? AND currentQuantity>1', [spId, user, spId, user, spId, user], function (err, result) {
            if (err) throw err;
            res.redirect('/products/ShoppingCart');
            con.end();
        });
    }
});

/*remove product*/
router.get('/remove/:id', function (req, res) {
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
    else {
        var user = res.locals.islogin;
        var spId = req.params.id;
        var con = db.connect((err) => {
            if (err) throw err;
        });
        con.query('Delete FROM shoppingcart WHERE sp_id=? AND user_id=?', [spId, user], function (err, result) {
            if (err) throw err;
            res.redirect('/products/ShoppingCart');
            con.end();
        });

    }
});

/*product*/
router.get('/', function (req, res) {
    var con = db.connect((err) => {
        if (err) throw err;
    });
    if (req.query.page) {
        var page = parseInt(req.query.page);
    }
    var current_page = (page == null) ? 1 : page;
    var itemNo = 3;
    if (req.query.search && req.query.keyword) {
        var search = req.query.search;
        var keyword = req.query.keyword;
        con.query("SELECT COUNT(*) AS sum FROM smartphone WHERE ?? LIKE ?;", [search, '%' + keyword + '%'], function (err, result) {
            if (err) throw err;
            if (result[0] === undefined) {
                if (req.session.islogin) {
                    res.render('carts/items', {
                        login: req.session.islogin,
                        type: req.session.type
                    });
                } else {
                    res.render('carts/items');
                }
            } else {
                var total = result[0].sum;
                con.query('SELECT sp_id, name, brand, currentPrice, image, detail_image_1, ' +
                    'detail_image_2, processor, RAM, starRating, starRating*20 as starRatingInPercent' +
                    ' FROM smartphone WHERE ?? LIKE ? LIMIT ?, ?;', [search, '%' + keyword + '%',
                    (current_page - 1) * itemNo, (current_page - 1) * itemNo + itemNo], function (err, row) {
                    if (err) throw err;
                    var next_page = current_page + 1;
                    var prep_page = current_page - 1;
                    var maxPage = Math.ceil(total / itemNo);
                    if (req.session.islogin) {
                        res.render('carts/items', {
                            search: search,
                            keyword: keyword,
                            maxPage: maxPage,
                            itemNo: itemNo,
                            prep_page: prep_page,
                            next_page: next_page,
                            current_page: current_page,
                            data: row,
                            csrfToken: req.csrfToken(),
                            login: req.session.islogin,
                            type: req.session.type
                        });
                    } else {
                        res.render('carts/items', {
                            search: search,
                            keyword: keyword,
                            maxPage: maxPage,
                            itemNo: itemNo,
                            prep_page: prep_page,
                            next_page: next_page,
                            current_page: current_page,
                            data: row,
                            csrfToken: req.csrfToken()
                        });
                    }
                });
            }
            con.end();
        });
    } else {
        con.query('SELECT COUNT(*) AS sum FROM smartphone;', function (err, result) {
            if (err) throw err;
            var total = result[0].sum;
            console.log(total)
            con.query('SELECT sp_id, name, brand, currentPrice, image, detail_image_1, detail_image_2, processor, RAM, starRating, starRating*20 as starRatingInPercent FROM smartphone LIMIT ?, ?;', [(current_page - 1) * itemNo, (current_page - 1) * itemNo + itemNo], function (err, row) {
                if (err) throw err;
                var next_page = current_page + 1;
                var prep_page = current_page - 1;
                var maxPage = Math.ceil(total / itemNo);
                if (req.session.islogin) {
                    res.render('carts/items', {
                        maxPage: maxPage,
                        itemNo: itemNo,
                        prep_page: prep_page,
                        next_page: next_page,
                        current_page: current_page,
                        data: row,
                        csrfToken: req.csrfToken(),
                        login: req.session.islogin,
                        type: req.session.type
                    });
                } else {
                    res.render('carts/items', {
                        maxPage: maxPage,
                        itemNo: itemNo,
                        prep_page: prep_page,
                        next_page: next_page,
                        current_page: current_page,
                        data: row,
                        csrfToken: req.csrfToken()
                    });
                }
                con.end();
            });
        });
    }
});


module.exports = router;
