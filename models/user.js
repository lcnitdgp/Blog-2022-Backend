var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Joi = require('joi');

var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
    name: {
      type: String,
      
    }, 
    email : {
      type: String,      
    },
 
    googleId:{
      type: String
    },
    image: {
      type: String
    }
    
});

const User = mongoose.model('user',userSchema);
module.exports = User;
