var mongoose = require('mongoose');
var mongoUrl = process.env.MONGO_LABS_URL || 'mongodb://localhost/localshortly'
var db = mongoose.connect(mongoUrl, function() {
  console.log('connected to mango', mongoUrl);
});



module.exports = db;
