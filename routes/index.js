var express = require('express');
var router = express.Router();
var User = require('../Models/UserModel');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index/index', {
        title: 'Symphony Streaming'
    });
});


router.get('/upload', function (req, res, next) {
    res.render('forms/uploadForm', {
        title: "Upload a file"
    })
})

module.exports = router;