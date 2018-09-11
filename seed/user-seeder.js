let User = require('../Models/UserModel');
let mongoose = require('mongoose');

mongoose.connect('localhost:27017/SymphonyStreaming');

let user = new User({
    userName: 'testUser1',
    userEmail: 'testUser@email.com',
    userPassword: 'password'
});

//WARNING, if we ever add multiple users for seeding,
//we must make sure that the db disconnects after running through the entire
//array user objects and only disconnect on the last one.
//This will be done becuase they will save to the database ASYNC and the
//db will just disconnect if it is set after a loop. 
user.save();

mongoose.disconnect();


//SymphonyStreaming for db, users for table

//also must run this file for the data to actually save to the db, just run from termial