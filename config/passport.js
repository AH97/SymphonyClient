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
    userEmail: 'emailAddress',
    userPassword: 'password',
    userName:'userName',
    passReqToCallback: true
}, function(req, userEmail, userPassword, userName, done){
    User.findOne({'userEmail': userEmail}, function(err, user){
        if(err){
            return done(err);
        }
        if(user){
            return done(null, false, {message: 'Email is already in use.'});
        }
        let newUser = new User();
        newUser.userEmail = userEmail;
        newUser.userPassword = newUser.encryptPassword(userPassword);
        newUser.save(function(err, result){
            if (err){
                return done(err);
            }
            return done(null, newUser);
        });
        newUser.userName = userName;

    });
}));