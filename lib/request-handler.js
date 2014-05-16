var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var util = Promise.promisifyAll(require('../lib/utility'));

var db = require('../app/config');
var User = Promise.promisifyAll(require('../app/models/user'));
var Link = Promise.promisifyAll(require('../app/models/link'));

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

// ===== dev helper ===== TODO REMOVE LATER
exports.findUsers = function(req, res) {
  User.find({},function(err, users){
    console.log(users);
    res.send(200, users);
  });
};

exports.fetchLinks = function(req, res) {
  Link.findAsync().then(function(links) {
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOneAsync({url: uri}) //username:username
    .then(function(link) {
      if(link) {
        console.log(link); // TODO remove
        res.send(200, link); // TODO needed for individual links
      } else {
        return util.getUrlTitleAsync(uri)
          .then(function(title) {
            return new Link({
              url: uri,
              title: title,
              base_url: req.headers.origin
              // TODO user: needed for individual links
            }).makeCode();
          });
      }
    })
    .then(function(link) {
      console.log(link)
      link.save();
      res.send(200, link);
    });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOneAsync({username: username})
    .then(function(user){
      if(user) {
        console.log('User', user.username, 'exists');
        return user;
      } else {
        console.log('User', username, 'does not exist');
        return res.redirect('/login');
      }
    }).then(function(user) {
      return user.comparePassword(password); // returns user if correct password, else does not return??
    }).then(function(user) {
      if(user) {
        util.createSession(req, res, user);
      }
    });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOneAsync({username: username})
    .then(function (user) {
      if (user) {
        console.log('Ignoring duplicate signup for: ', user.username);
        res.redirect('/signup');
      } else {
        console.log('Signing up:', username);
        return new User({
          username: username,
          password: password
        });
      }
    })
    .then(function (user) {
      return user.hashPassword();
    })
    .then(function (user) {
      user.save();
      util.createSession(req, res, user);
    });
};

exports.navToLink = function(req, res) {
  Link.findOneAsync({ code: req.params[0] })
    .then(function(link){
      if (link) {
        link.visits += 1;
        link.save();
        return res.redirect(302, link.url);
      }
      res.redirect('/');
    });
};
