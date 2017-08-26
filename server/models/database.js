const mongoose = require('mongoose');


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://oladimeji:1234@127.0.0.1:27017/pair', function(err) {
	if (err) {
		console.log('Not connected to db: ', err);
	} else {
		console.log('Connected to DB');
	}
});