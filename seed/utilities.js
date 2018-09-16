$('#btnFileSubmit').click(function () {
    let mongoose = require('mongoose')
    let schema = mongoose.Schema

    mongoose.connect('mongodb://127.0.0.1/gridFS')
    let conn = mongoose.connection
    let path = require('path')
    let Grid = require('gridfs-stream');
    let fs = require('fs');

    let file = path.join(__dirname, '/../public/mp3/gta.mp3')
    Grid.mongo = mongoose.mongo

    conn.once('open', function () {
        console.log('Connection open')
        let gfs = Grid(conn.db)

        let writestream = gfs.createWriteStream({
            filename: 'test.mp3'
        });


        fs.createReadStream(file).pipe(writestream)
        writestream.on('close', (file) => {
            console.log("UPLOADED")
        })
    });
});
