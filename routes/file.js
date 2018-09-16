let express = require('express');
let router = express.Router();
let fileModel = require('../Models/FileModel')
<<<<<<< HEAD
let mongoose = require('mongoose')
let schema = mongoose.Schema

// mongoose.connect('localhost:27017/SymphonyStreaming')
mongoose.connect('mongodb://127.0.0.1/gridFS')

=======
mongoose.connect('mongodb://admin:symphonyadmin1@ds153002-a0.mlab.com:53002,ds153002-a1.mlab.com:53002/symphonydb?replicaSet=rs-ds153002')
>>>>>>> 6373b6aca90e62bf4c83ba204c9994496ffa203f
let conn = mongoose.connection
let path = require('path')
let Grid = require('gridfs-stream');
let fs = require('fs');

let file = path.join(__dirname, '/../public/mp3/starDestroyer.jpg')

Grid.mongo = mongoose.mongo


router.post('/upload', (req, res) => {    

    
    conn.once('open', function() {
        console.log('Connection open')
        let gfs = Grid(conn.db)
    
        let writestream = gfs.createWriteStream({
            filename: 'aDifferentNameThatsNotaDumbNamingConvention/jpg'
        });
    
    
        fs.createReadStream(file).pipe(writestream)
        writestream.on('close', (file) => {
            console.log("UPLOADED")
        })
    });
});

router.get('/download', (req, res) => {
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

router.get('/delete', (req, res) => {
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