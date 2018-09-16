var express = require('express');
var router = express.Router();
var Grid = require('gridfs-stream');
var fs = require('fs');
var fileModel = require('../Models/FileModel')

router.post('/file/upload', (req, res) => {
    // var fileName = req.body.fileName;
    // var fileDescription = req.body.fileDescription
    var file = path.join(__dirname, '../public/mp3/gta.mp3')
    Grid.mongo = mongoose.mongo

    conn.once('open', function() {
        console.log('Connection open')
        let gfs = Grid(conn.db)

        let writestream = gfs.createWriteStream({
        filename: 'gta.mp3'
        });
    })


    fs.createReadStream(file).pipe(writestream)
    writestream.on('close', (file) => {
        res.send('Stored File: ' + file.filename);
    });
});

router.get('/file/download', (req, res) => {
    var filename = req.query.filename;

    gfs.exist({ filename: filename }, (err, file) => {
        if (err || !file) {
            res.status(404).send('File Not Found');
            return
        }
        var readstream = gfs.createReadStream({ filename: filename });
        readstream.pipe(res);
    });
});

router.get('/file/delete', (req, res) => {
    var filename = req.query.filename;

    gfs.exist({ filename: filename }, (err, file) => {
        if (err || !file) {
            res.status(404).send('File Not Found');
            return;
        }

        gfs.remove({ filename: filename }, (err) => {
            if (err) res.status(500).send(err);
            res.send('File Deleted');
        });
    });
});

module.exports = router;