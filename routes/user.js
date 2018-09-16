let express = require('express');
let router = express.Router();
let csrf = require('csurf');
let passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET login page. */
router.get('/login', function (req, res, next) {
    let messages = req.flash('error');
    res.render('user/loginForm', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

/* GET signup page. */
router.get('/signup', function (req, res, next) {
    let messages = req.flash('error');
    res.render('user/signupForm', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

/* GET account page. */
router.get('/account', function (req, res, next) {
    res.render('user/account', {
        userName: req.user.userName
    });
});

/* Logout */
router.get('/logout', function (req, res){
    req.session.destroy(function (err) {
        res.redirect('/'); //Inside a callback… bulletproof!
    });
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/account',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

router.post('/login', passport.authenticate('local.login', {
    successRedirect: '/user/account',
    failureRedirect: '/user/login',
    failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}