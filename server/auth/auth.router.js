'use strict';
var crypto = require('crypto');
var iterations = 1;
var bytes = 64;



var router = require('express').Router();

var HttpError = require('../utils/HttpError');
var User = require('../api/users/user.model');

router.post('/login', function (req, res, next) {
	
	if( req.body.email && req.body.password ) {
		
		User.findOne({ email: req.body.email })
		.select('+salt +password')
		.then(function (user) {
			var salt = user.salt;
			var hash = crypto.pbkdf2Sync(req.body.password, salt, iterations, bytes).toString('base64');

			if(hash!==user.password) throw HttpError(401);
			
			user = user.toObject();
			delete user.salt;
			delete user.password;

			req.login(user, function () {
				res.json(user);
			});
		})
		.then(null, next);
	
	}

});

router.post('/signup', function (req, res, next) {
	
	var salt = crypto.randomBytes(16).toString('base64');
	var buffer = crypto.pbkdf2Sync(req.body.password, salt, iterations, bytes);
	var hash = buffer.toString('base64');
	
	req.body.salt = salt;
	req.body.password = hash;
	req.body.isAdmin = false;

	User.create(req.body)
	.then(function (user) {
		console.log('user', user);
		req.login(user, function () {
			res.status(201).json(user);
		});
	})
	.then(null, next);
});

router.get('/me', function (req, res, next) {
	res.json(req.user);
});

router.delete('/me', function (req, res, next) {
	req.logout();
	res.status(204).end();
});

router.use('/google', require('./google.oauth'));

router.use('/twitter', require('./twitter.oauth'));

router.use('/github', require('./github.oauth'));

module.exports = router;