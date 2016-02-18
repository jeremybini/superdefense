'use strict'; 

var router = require('express').Router(),
	session = require('express-session'),
	passport = require('passport');

var secrets = require('../../config/keys');
var bodyParser = require('body-parser');
var User = require('../api/users/user.model');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.use(session({
	secret: secrets.session,
	resave: false,
	saveUninitialized: false
}));

passport.serializeUser(function (user, done) {
	done(null, user._id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, done);
});

router.use(passport.initialize());

router.use(passport.session());

module.exports = router;