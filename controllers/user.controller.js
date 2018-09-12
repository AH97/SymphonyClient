var User = require('../Models/UserModel') 
var debug = require('debug')('demo:user') 

function sendJSONresponse(res, status, content) {
    res.status(status) 
    res.json(content) 
} 

module.exports.readAll = function(req, res) {
        
    debug('Getting all users') 
    User
     .find()
     .exec()
     .then(function(results){
        sendJSONresponse(res, 200, results) 
     })
     .catch(function(err){
        sendJSONresponse(res, 404, err)          
     }) 
    
} 

module.exports.read = function(req, res) {
    
    if (req.params && req.params.userid) {
        debug('Getting single user with id =', req.params.userid ) 
        
        User
        .findById(req.params.userid)
        .exec()
        .then(function(results){
            sendJSONresponse(res, 200, results) 
        }).catch(function(err){
            sendJSONresponse(res, 404, {
                "message": "userid not found"
            }) 
        }) 

    } else {
        sendJSONresponse(res, 404, {
            "message": "userid not found"
        }) 
    }
} 

/*   POST a new review
 *   /api/v1/reviews 
 */
module.exports.create = function(req, res) {
    
    debug('Creating a user with data ', req.body) 

    User.create({
          userName: req.body.username,
          userEmail: req.body.email,
          userPassword: req.body.password
    })
    .then(function(dataSaved){
        debug(dataSaved) 
        sendJSONresponse(res, 201, dataSaved) 
    })
    .catch(function(err){ 
        debug(err) 
        sendJSONresponse(res, 400, err) 
    }) 
     
} 

module.exports.update = function(req, res) {
    
  if ( !req.params.userid ) {
    sendJSONresponse(res, 404, {
        "message": "Not found, userid is required"
    }) 
    return 
  }
  
  User
    .findById(req.params.userid)
    .exec()
    .then(function(userData) {        
        userData.userName = req.body.username 
        userData.userEmail = req.body.email 
        userData.userPassword = req.body.password 

        return userData.save() 
    })
    .then(function(data){
        sendJSONresponse(res, 200, data) 
    })
    .catch(function(err){
        sendJSONresponse(res, 400, err) 
    }) 
        
} 

module.exports.delete = function(req, res) {
  if ( !req.params.userid ) {
    sendJSONresponse(res, 404, {
        "message": "Not found, uploadid is required"
    }) 
    return 
  }
  
  User
    .findByIdAndRemove(req.params.userid)
    .exec()
    .then(function(data){
        debug("Review id " + req.params.userid + " deleted") 
        debug(data) 
        sendJSONresponse(res, 204, null) 
    })
    .catch(function(err){
        sendJSONresponse(res, 404, err) 
    }) 
    
} 