'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var login = require('./routes/login');
var register = require('./routes/register');
var dashboard = require('./routes/dashboard');
var logout = require('./routes/logout');
var session = require("express-session");
var flash = require("express-flash");
const passport = require("passport");
const initializePassport = require("./passportConfig");

var app = express();
initializePassport(passport);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middlewares
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/login', checkAuthen, login);
app.use('/register', checkAuthen, register);
app.use('/dashboard', checkNotAuth, dashboard);
app.use('/logout', logout);

app.get('/', (req, res) => {
    res.render("index");
});

function checkAuthen(req,res,next) {
    if (req.isAuthenticated()) { return res.redirect("/dashboard"); }
    next();
}
function checkNotAuth(req,res,next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect("/login");
}

//catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
/*
// production error handler
 //no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
*/
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});