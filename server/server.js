const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	path = require('path'),
	http = require('http').Server(app);


// loading env variables
require('dotenv').config();

app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(express.static(path.join(__dirname,  './../client')));
app.use("/session", express.static(path.join(__dirname,  './../client')));
app.use("/password-reset", express.static(path.join(__dirname,  './../client')));
app.use(express.static(path.join(__dirname + './../template')));

if(process.env.NODE_ENV != "production"){
	const morgan = require('morgan');
  app.use(morgan('dev'));
}

//load all routes
app.use(require('./routes/index'));

app.set('port', process.env.PORT || 8000);

// connecting to database
require("./models/database");

// connecting to socket.io
require('./socket/socket').initialise(http);

http.listen(app.get('port'), function (err) {
  if (!err) console.log('server listening on port ', app.get('port'));
  else console.log(err);
});

module.exports = app;
