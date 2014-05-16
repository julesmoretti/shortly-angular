var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  password: String
});

userSchema.methods.hashPassword = function() {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      return this;
    });
};

userSchema.methods.comparePassword = function(password) {
  var cipher = Promise.promisify(bcrypt.compare);
  console.log(password, this.password);
  return cipher(password, this.password).bind(this)
    .then(function(matches) {
      if(matches) {
        console.log('password match!')
        return this;
      }
    });
};

var User = mongoose.model('User', userSchema);

module.exports = User;
