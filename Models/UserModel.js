let express = require('express')
let mongoose = require('mongoose')
let router = express.Router()
let Schema = mongoose.Schema

let userSchema = new Schema({
    userName: {type: String, required: true},
    userEmail: {type: String, required: true},
    userPassword: {type: String, required: true},
    userIsAdmin: {
        type: Boolean,
        "default": false
    },
    createdOn: {
        type: Date,
        "default": Date.now
    }
});

let User = mongoose.model('User', userSchema);

module.exports = User;