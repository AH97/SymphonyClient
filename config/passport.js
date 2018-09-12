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