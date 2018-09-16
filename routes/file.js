let express = require('express');
let router = express.Router();
let fileModel = require('../Models/FileModel')
mongoose.connect('localhost:27017/SymphonyStreaming')
let conn = mongoose.connection
let path = require('path')
let Grid = require('gridfs-stream');
let fs = require('fs');


router.post('/file/upload', (req, res) => {
    // let fileName = req.body.fileName;
    // let fileDescription = req.body.fileDescription
    let file = path.join(__dirname, '../public/mp3/gta.mp3')
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