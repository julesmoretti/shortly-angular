var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var linkSchema = new Schema({
  url: String,
  title: String,
  visits: { type: Number, default: 0 },
  base_url: String,
  code: String
});

linkSchema.methods.makeCode = function() {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  return this;
};

var Link = mongoose.model('Link', linkSchema);

module.exports = Link;
