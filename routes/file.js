const express = require('express');
const router = express.Router();

const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const fs = require('fs');
const path = require('path');

//configuring the AWS environment
AWS.config.update({
    accessKeyId: "AKIAJT4OUSXQAU6GF2HA",
    secretAccessKey: "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"
  });

let s3 = new AWS.S3();


let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'neit-symphony-capstone',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    })
});

// GET route to view form
router.get('/', (req, res) => {
    res.render('file/upload')
})

router.post('/', upload.single('upload'), function (req, res, next) {
    res.send("Uploaded!");
});

module.exports = router