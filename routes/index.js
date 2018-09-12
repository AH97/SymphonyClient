var express = require('express');
var router = express.Router();
var csrf = require('csurf');
let passport = require('passport');
var User = require('../Models/UserModel');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Symphony Streaming'
    });
});

/* GET login page. */
router.get('/login', function (req, res, next) {
    res.render('user/loginForm', {
        title: 'Symphony Streaming Login'
    });
});

/* GET signup page. */
router.get('/signup', function (req, res, next) {
    let messages = req.flash('error');
    res.render('user/signupForm', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});

});

/* GET accout page. */
router.get('/account', function (req, res, next) {
    res.render('user/account', {
        userName: req.user.userName
    });
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/account',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/upload', function (req, res, next) {
    res.render('forms/uploadForm', {
        title: "Upload a file"
    })
})

module.exports = router;