let mongoose = require('mongoose')
let Schema = mongoose.Schema
let bcrypt = require('bcrypt-nodejs')

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

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

let User = mongoose.model('User', userSchema);

module.exports = User;