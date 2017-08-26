var mongoose = require('mongoose'),
    bycrypt = require('bcrypt-nodejs'),
    tiltlize = require('mongoose-title-case'),
    validate = require('mongoose-validator'),
    Schema = mongoose.Schema;

// var nameValidator = [
//     validate({
//         validator: 'matches',
//         arguments: /^([a-zA-z]{2,}[\\s]+[a-zA-z]{2,})$/,
//         message: 'Enter firstname and lastname seperated by space'
//     })
// ];

// var usernameValidator = [
//     validate({
//         validator: 'matches',
//         arguments: /^(?=.*?[a-zA-Z\\d]).{6,35}$/,
//         message: 'Username must contain characters or digits or character-digit'
//     })
// ];

var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'Invalid email'
    }),

    // validate({
    //     validator: 'isLength',
    //     arguments: [4, 25],
    //     message: 'Email length should be btw {ARG[0]} and {ARG[1]}'
    // })
];

// var passwordValidator = [
//     validate({
//         validator: 'matches',
//         arguments: /^((?=.*?[a-zA-Z\\d\\W])|(?=.*?[a-zA-Z\\W])|(?=.*?[a-zA-Z\\d])|(?=.*?[a-zA-Z])|(?=.*?[\\d\\W])|(?=.*?[a-zA-Z])|(?=.*?[\\d])).{1,35}$/,
//         message: 'Invalid password'
//     })
// ]


var UserSchema = new Schema({
    username: { type: String, minlength: 2, required: true, unique: true },
    email: { type: String, minlength: 2, require: true, validate: emailValidator, unique: true },
    password: { type: String, minlength: 1, require: true }
});

UserSchema.pre('save', function(next) {
    var user = this;
    bycrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    })
});

UserSchema.methods.comparePassword = function(password) {
    return bycrypt.compareSync(password, this.password);
}

//to title case user's firstname and lastname
// UserSchema.plugin(tiltlize, {
//     paths: ['name']
// });

var SessionSchema = new Schema({
    username: { type: String, required: true },
    keyword: { type: String, required: true, unique: true },
    session_data: { type: String }
});

module.exports = {
    user: mongoose.model('User', UserSchema),
    session: mongoose.model('Session', SessionSchema)
};