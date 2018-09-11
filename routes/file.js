var express = require('express');
var router = express.Router();
var gfs = require('gridfs-stream');
var fs = require('fs');

router.get('/file/upload', (req, res) => {
    var filename = req.query.filename;
		
    var writestream = gfs.createWriteStream({ filename: filename });
    fs.createReadStream(__dirname + "/uploads/" + filename).pipe(writestream);
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

module.exports = router;