/* SER 421 Lab 3
 *
 * Reference Attributes: Kevin Gary, Brad Dayley
 *
 * EJS Views referenced from:
 * https://github.com/kgary/ser421public/blob/master/NodeExpress/templates/express_templates.js
 *
 * Body-parser referenced from:
 * https://github.com/kgary/ser421public/blob/master/NodeExpress/express_post.js
 *
 * Additional Authors:
 * Lizz Layman(elayman1): For constructing using Node-Fetch API 
 */
 
var express = require('express');
var fetch = require('node-fetch');
var bParse = require('body-parser');
var ejs = require('ejs');
var calc = require('./calc.js');

var calc = new calc();
var app = express();
app.set('views', 'html');
app.engine('html', ejs.renderFile);
app.use(bParse.urlencoded({ extended: true }));

app.listen(8008, () => {
	console.log("Server and Application are now running on Port: 8008");
});

/* To Execute:
 * Open the Static File (This will fetch responses from the server.)
 */

//-------------------------------------------------------------------------------------------------

// GET for Home
app.get('/', function(req, res) {
	app.render('main.html', function(error, data) {
		res.set({'Cache-Control': 'no-cache, no-store'});
		res.status(200);
		res.type('html');
		res.send(data);
	});
});

//-------------------------------------------------------------------------------------------------

// POST and GET methods for Pop
app.get('/pop', function(req, res) {
	if(calc.getStack().length > 0) {
		calc.pop();
		var payload = {value:calc.getCurrVal(), stack:calc.getStack()};
		res.status(200);
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		res.type('json');
		res.send(payload);
	} else {
		error500(req, res);
	}
});

app.post('/pop', function(req, res) {
	if(calc.getStack().length > 0) {
		calc.pop();
		var payload = {value:calc.getCurrVal(), stack:calc.getStack()};
		res.status(200);
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		res.type('json');
		res.send(payload);
	} else {
		error500(req, res);
	}
});

//-------------------------------------------------------------------------------------------------

// POST methods for Add and Subtract
app.post('/add', function(req, res) {
	var num = parseInt(req.body.number);
	if(isNaN(num)) {
		error500(req, res);
		return;
	}
	var userAgent = req.get('User-Agent');
	var op = '+';
	var ipAddr = req.ip;
	calcOperation({operation:op, operand:num, ip:ipAddr, user:userAgent});
	var payload = {value:calc.getCurrVal(), stack:calc.getStack()};
	res.status(200);
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.type('json');
	res.send(payload);
});

app.post('/subtract', function(req, res) {
	console.log(req.body.number);
	var num = parseInt(req.body.number);
	if(isNaN(num)) {
		error500(req, res);
		return;
	}
	var userAgent = req.get('User-Agent');
	var op = '-';
	var ipAddr = req.ip;
	calcOperation({operation:op, operand:num, ip:ipAddr, user:userAgent});
	var payload = {value:calc.getCurrVal(), stack:calc.getStack()};
	res.status(200);
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.type('json');
	res.send(payload);
});

// GET method for Reset
app.get('/reset', function(req, res) {
	calc.reset();
	var payload = {value:0, stack:[]};
	res.status(200);
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.type('json');
	res.send(payload);
});

//-------------------------------------------------------------------------------------------------

// GET method for History and API
app.get('/history', function(req, res) {
	var payload = {stack:calc.getStack()};
	res.status(200);
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.type('json');
	res.send(payload);
});

app.get('/api', function(req, res) {
	app.render('API.html', function(error, data) {
		res.set({'Cache-Control': 'no-cache, no-store'});
		res.status(200);
		res.type('html');
		res.send(data);
	});
});

//-------------------------------------------------------------------------------------------------

// Express GET 405 and 404 Error Handlers
app.get('/subtract', function(req, res) {
	error405(req, res);
});

app.get('/add', function(req, res) {
	error405(req, res);
});

app.post('/reset', function(req, res) {
	error405(req, res);
});

app.all('/*', function(req, res) {
	error404(req, res);
});

//-------------------------------------------------------------------------------------------------

// Stores Previous Operations
function calcOperation(dict) {
	calc.calc(dict);
}

//-------------------------------------------------------------------------------------------------

// Express GET Error Pages
function error500(req, res) {
	var payload = { status:500, err:'Internal server error! Error 500!' };
	res.status(500);
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.type('json');
	res.send(payload);
}

function error404(req, res) {
	var payload = { status:404, err:'The page does not exist! Error 404!' };
	res.status(404);
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.type('json');
	res.send(payload);
}

function error405(req, res) {
	var payload = { status:405, err:'Improper method! Error 405!' };
	res.status(405);
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.type('json');
	res.send(payload);
}

//-------------------------------------------------------------------------------------------------

// API Page
