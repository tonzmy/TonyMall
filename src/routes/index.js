var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.islogin){
        res.locals.islogin = req.session.islogin;
        res.locals.type = req.session.type;
    }
    if(req.cookies.islogin){
        req.session.islogin = req.cookies.islogin;
        req.session.type = req.cookies.type;
    }
    if(!req.cookies.islogin || !req.session.islogin){
        res.render('home/index', { title: req.csrfToken()} );
    }
    else {
        var user = res.locals.islogin;
        var type = res.locals.type;
        res.render('home/index', {csrfToken: req.csrfToken(), login: user, type: type});
    }
});

module.exports = router;
