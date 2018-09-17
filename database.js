let debug = require('debug')('demo:mongo');
let mongoose = require('mongoose');
let gracefulShutdown;
let dbURI = 'mongodb://admin:symphonyadmin1@ds153002-a0.mlab.com:53002,ds153002-a1.mlab.com:53002/symphonydb?replicaSet=rs-ds153002';
if (process.env.NODE_ENV === 'production') {
    dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI, {
  useMongoClient: true,
  /* other options */
});

mongoose.Promise = Promise;

// CONNECTION EVENTS
mongoose.connection.on('connected', function() {
    debug('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
    debug('Mongoose connection error: ' + err);
    process.exit(0);
});
mongoose.connection.on('disconnected', function() {
    debug('Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
        debug('Mongoose disconnected through ' + msg);
        callback();
    });
};
// For nodemon restarts
process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', function() {
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});
// For Heroku app termination
process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app termination', function() {
        process.exit(0);
    });
});

process.on('exit', function(code) {
  debug('About to exit with code: ', code);
});