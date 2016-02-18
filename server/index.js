'use strict';

var app = require('./app'),
	path = require('path'),
	db = require('./db'),
	https = require('https'),
	fs = require('fs');

var privateKey = fs.readFileSync(path.join(__dirname, '../key.pem' ));
var certificate = fs.readFileSync(path.join(__dirname, '../cert.pem' ));
var port = 8080;

var server = https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(port, function() {
	console.log('HTTP server patiently listening on port', port);
});

module.exports = server;