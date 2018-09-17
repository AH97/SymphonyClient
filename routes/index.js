var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index/index', {
        title: 'Symphony Streaming',
        name: req.body.name
    });
});

router.post('/', function (req, res, next) {
    res.render('index/index', {
        title: req.body.name,
        name: req.body.name
    })
})

module.exports = router;