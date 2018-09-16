let express = require('express');
let router = express.Router();
let fileModel = require('../Models/FileModel')
let mongoose = require('mongoose')
let schema = mongoose.Schema
let path = require('path')
let GridFsStorage = require('multer-gridfs-storage')
let Grid = require('gridfs-stream');
let fs = require('fs');
let multer = require('multer')


// create connection to mlab using mongoURI
let mongoURI = 'mongodb://admin:symphonyadmin1@ds153002-a0.mlab.com:53002,ds153002-a1.mlab.com:53002/symphonydb?replicaSet=rs-ds153002'
let conn = mongoose.createConnection(mongoURI)

// init gfs
let gfs;

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
  });

// Create storage engine
 const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });

// THIS ROUTE GETS THE FORM
  router.get('/', (req, res) => {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        res.render('index/index', { files: false });
      } else {
        files.map(file => {
          if (
            file.contentType === 'image/jpeg' ||
            file.contentType === 'image/png'
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
        });
        res.render('index', { files: files });
      }
    });
  });
  // =========================
  // TO BE EDITED EVERYTHING BELOW
  // =========================
// router.post('/upload', (req, res) => {    

    
//     conn.once('open', function() {
//         console.log('Connection open')
//         let gfs = Grid(conn.db)
    
//         let writestream = gfs.createWriteStream({
//             filename: 'aDifferentNameThatsNotaDumbNamingConvention/jpg'
//         });
    
    
//         fs.createReadStream(file).pipe(writestream)
//         writestream.on('close', (file) => {
//             console.log("UPLOADED")
//         })
//     });
// });

// router.get('/download', (req, res) => {
//     var filename = req.query.filename;

//     gfs.exist({ filename: filename }, (err, file) => {
//         if (err || !file) {
//             res.status(404).send('File Not Found');
//             return
//         }
//         var readstream = gfs.createReadStream({ filename: filename });
//         readstream.pipe(res);
//     });
// });

// router.get('/delete', (req, res) => {
//     var filename = req.query.filename;

//     gfs.exist({ filename: filename }, (err, file) => {
//         if (err || !file) {
//             res.status(404).send('File Not Found');
//             return;
//         }

//         gfs.remove({ filename: filename }, (err) => {
//             if (err) res.status(500).send(err);
//             res.send('File Deleted');
//         });
//     });
// });

module.exports = router;