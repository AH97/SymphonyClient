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
    res.render('loginSignUp/loginForm', {
        title: 'Symphony Streaming Login'
    });
});

/* GET signup page. */
router.get('/signup', function (req, res, next) {
    res.render('loginSignUp/signupForm', {csrfToken: req.csrfToken()});

});

/* GET accout page. */
router.get('/myAccount', function (req, res, next) {
    res.render('user/myAccount', {
        userName: req.user.userName
    });
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: 'user/myAccount',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/upload', function (req, res, next) {
    res.render('forms/uploadForm', {
        title: "Upload a file"
    })
})

module.exports = router;