let passport = require('passport')
let User = require('../Models/UserModel')
let LocalStrategy = require('passport-local').Strategy

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.use('local.signup', new LocalStrategy({
    userName: 'name',
    userEmail: 'email',
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

}))