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

    // @route POST request to upload files to database
router.post('/upload', upload.single('file'), (req, res) => {
  // res.json({ file: req.file });
  res.redirect('/');
});

// @route GET request to display all files in JSON
router.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files);
  });
});

// @route GET request to get file object
router.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // File exists
    return res.json(file);
  });
});

// GET request to get image with specific file name
router.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

// @route DELETE request to delete file with specific ID from database
router.delete('/files/:id', (req, res) => {
  gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.redirect('/');
  });
});
  // =========================
  // OLD CODE DOWN BELOW
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