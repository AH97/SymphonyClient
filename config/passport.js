let passport = require('passport')
let User = require('../Models/UserModel')
let LocalStrategy = require('passport-local').Strategy

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'emailAddress',
    userPassword: 'password',
    passReqToCallback: true
}, function(req, userEmail, userPassword, done){
    User.findOne({'userEmail': userEmail}, function(err, user){
        if(err){
            return done(err);
        }
        if(user){
            return done(null, false, {message: 'Email is already in use.'});
        }
        let newUser = new User();
        newUser.userEmail = userEmail
        newUser.userName = req.body.userName;
        newUser.userPassword = newUser.encryptPassword(userPassword);
        newUser.save(function(err, result){
            if (err){
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));

passport.use('local.login', new LocalStrategy({
    usernameField: 'emailAddress',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, userEmail, password, done) {
    req.checkBody('emailAddress', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'userEmail': userEmail}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'No user found.'});
        }
        if (!user.validPassword(password)) {
            return done(null, false, {message: 'Wrong password.'});
        }
        return done(null, user);
    });
}));