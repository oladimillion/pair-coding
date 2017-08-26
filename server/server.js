const express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	path = require('path'),
	app = express(),
	http = require('http').Server(app),
	session = require('express-session');

app.disable('x-powered-by');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(session({
	secret: 'test',
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 600000
	}
}))

app.use(express.static(__dirname + './../client'));
app.use(express.static(__dirname + './../template'));

//load all routes
app.use(require('./routes/index'));

app.set('port', process.env.PORT || 8000);

// connecting to database
// require("./models/database");

// connecting to socket.io
require('./socket/socket').initialise(http);

http.listen(app.get('port'), function (err) {
	if (!err) console.log('server listening on port ', app.get('port'));
	else console.log(err);
});

module.exports = app;