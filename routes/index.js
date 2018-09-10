let express = require('express');
let router = express.Router();
let request = require('request-json')
let client = request.createClient('http://localhost:5000/')


/* Homepage Routes */
router.get('/', function (req, res, next) {
    client.get('user/')
    .then(function(response) {
        res.render('index', { data: response.body })
    })
});

/* Login Page Routes*/
router.get('/login', function (req, res, next) {
    res.render('forms/loginForm', {
        title: 'Symhpony Streaming Login'
    });
});

/* Signup Page Routes */
router.get('/signup', function (req, res, next) {
    res.render('forms/signupForm', {
        title: 'Symhpony Streaming Signup'
    });
})
router.post('/signup', function (req, res, next) {
    fetch('http://localhost:5000/user', { method: 'POST', redirect: 'follow'})
    .then(response => {
        res.render('success', {
            title: 'User has been successfully created!'
        });
    })
    .catch(function(err) {
        console.info(err + " url: " + url);
    });
});

/* Account Page Routes */
router.get('/account', function (req, res, next) {
    res.render('user/myAccount', {
        title: 'Username account'
    });
});

module.exports = router;