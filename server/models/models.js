const mongoose = require('mongoose'),
	bycrypt = require('bcrypt-nodejs'),
	validate = require('mongoose-validator'),
	Schema = mongoose.Schema;

// const nameValidator = [
//     validate({
//         validator: 'matches',
//         arguments: /^([a-zA-z]{2,}[\\s]+[a-zA-z]{2,})$/,
//         message: 'Enter firstname and lastname seperated by space'
//     })
// ];

// USERNAME VALIDATION
const usernameValidator = [
	validate({
		validator: 'matches',
		arguments: /^(?=.*?[a-zA-Z\\d]).{4,20}$/,
		message: 'Username must be alphabets, numerics or alphanumerics of length between 4 and 20'
	}),

];

// EMAIL VALIDATION
const emailValidator = [
	validate({
		validator: 'isEmail',
		message: 'Invalid email'
	}),

	validate({
		validator: 'isLength',
		arguments: [4, 20],
		message: `Email must be between 4 and 20 in length`
	})
];

// PASSWORD VALIDATION
const passwordValidator = [
	validate({
		validator: 'isLength',
		arguments: [4, 20],
		message: `Password must be between 4 and 20 in length`
	})
];

// PHONE VALIDATION
const phoneValidator = [
	validate({
		validator: 'matches',
		arguments: /^\d{4,20}$/,
		message: `Phone should be digits between 4 and 20 in length`
	})
];

// USERS SCHEMA
const UserSchema = new Schema({
	username: {
		type: String,
		validate: usernameValidator,
		required: true,
		unique: true
	},
	email: {
		type: String,
		// minlength: 4,
		require: true,
		validate: emailValidator,
		unique: true
	},
	phone: {
		type: String,
		// minlength: 4,
		require: true,
		validate: phoneValidator,
		unique: true
	},
	password: {
		type: String,
		validate: passwordValidator,
		require: true
	}
});

// HASH USER PASSWORD BEFORE SAVE
UserSchema.pre('save', function(next) {
	const user = this;
	bycrypt.hash(user.password, null, null, function(err, hash) {
		if (err) return next(err);
		user.password = hash;
		next();
	})
});

// PASSWORD COMPARISON METHOD
UserSchema.methods.comparePassword = function(password) {
	return bycrypt.compareSync(password, this.password);
}


// SESSION TITLE VALIDATION
const titleValidator = [
	validate({
		validator: 'matches',
		arguments: /^(?=.*?[a-zA-Z\\d]).{2,20}$/,
		message: 'title must be alphabets, numerics or alphanumerics of length between 2 and 20'
	}),
];


// SESSION SCHEMA
const SessionSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true,
		unique: true,
		validate: titleValidator
	},
	session_data: {
		type: String
	}
});

module.exports = {
	User: mongoose.model('User', UserSchema),
	Session: mongoose.model('Session', SessionSchema)
};