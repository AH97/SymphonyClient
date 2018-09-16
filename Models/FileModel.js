let mongoose = require('mongoose')

let fileSchema = new mongoose.Schema({
    userID: String,
    fileName: String, // bullshit.txt test.mp3
    fileDesc: String,
    fileData: { 
        data: Buffer, 
        contentType: String
    },
    createdOn: {
        type: Date,
        "default": Date.now
    }
})
 
let Upload = mongoose.model('File', fileSchema)

module.exports = Upload