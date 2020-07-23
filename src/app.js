var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var routes = require('./routes/index');
var orderRoutes = require('./routes/purchaseOrder');
var userRoutes = require('./routes/user');
var vendorRoutes = require('./routes/vendor_purchaseOrder');
var cartRoutes = require('./routes/shopping');
var session = require('express-session');
var flash = require('connect-flash');
var app = express();

// view engine setup
app.engine('.hbs', expressHbs({
    defaultLayout: 'layout',
    extname: '.hbs',
    // cancel: require("/public/javascripts/paging.js").helpers
    helpers: {
       cancel: function (arg1, arg2, arg3) {
           return arg1 === arg2 || arg1 === arg3 ? true : false;
      }, check_type: function (arg1, arg2) {
            return arg1 === arg2 ? true : false;
        }, prep_pageNo: function (arg1) {
            return arg1 == 1 ? false : true;
        }, next_pageNo: function (arg1, arg2) {
            return arg1 >= arg2 ? false : true;
        }, checkVendor: function (arg1, arg2) {
            return arg1 === arg2 || arg1 == null ? true : false;
        }
    }
}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('yo'));
app.use(session({secret: 'hey', resave: false, saveUninitialized: false}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

//shopping cart
app.use('localhost/products/detail/:id', cartRoutes);
app.use('localhost/products/:type/:keyword', cartRoutes);
app.use('localhost/products/AddToCart/:id', cartRoutes);
app.use('localhost/products/AddToCart/', cartRoutes);
app.use('localhost/products/Add/:id', cartRoutes);
app.use('localhost/products/Subtract/:id', cartRoutes);
app.use('localhost/products/remove/:id', cartRoutes);
app.use('/ShoppingCart', cartRoutes); /* a little wired routes */
app.use('/products', cartRoutes);

// Vendor
app.use('localhost/vendor/order/past', vendorRoutes);
app.use('localhost/vendor/order/analysis', vendorRoutes);
app.use('localhost/vendor/order/changeprice', vendorRoutes);
app.use('localhost/vendor/order/hold/:num', vendorRoutes);
app.use('localhost/vendor/order/cancel/:num', vendorRoutes);
app.use('localhost/vendor/order/hold', vendorRoutes);
app.use('localhost/vendor/order/pending', vendorRoutes);
app.use('localhost/vendor/order/ship/:num', vendorRoutes);
app.use('localhost/vendor/order/:num', vendorRoutes);
app.use('/vendor/order', vendorRoutes);

//order
app.use('localhost/order/current', orderRoutes);
app.use('localhost/order/past', orderRoutes);
app.use('localhost/order/cancel/:num', orderRoutes);
app.use('localhost/order/:num', orderRoutes);
app.use('/order', orderRoutes);

//user
app.use('localhost/user/logout',userRoutes);
app.use('localhost/user/signup',userRoutes);
app.use('localhost/user/login',userRoutes);
app.use('/user', userRoutes);

// index
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
