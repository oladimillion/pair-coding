const mongoose = require('mongoose');

//connecting to database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.SERVER_MONGODB_URI || process.env.LOCAL_MONGODB_URI, function(err) {
	if (err) {
		console.log('Not connected to db: ', err);
	} else {
		console.log('Connected to DB');
	}
});
