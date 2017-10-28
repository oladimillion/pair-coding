const mongoose = require('mongoose'),
	bycrypt = require('bcrypt-nodejs'),
	Schema = mongoose.Schema;

// USERS SCHEMA
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  phone: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    select: false
  }
});

// HASH USER PASSWORD BEFORE SAVE
UserSchema.pre('save', function(next)  {
  const user = this;
  bycrypt.hash(user.password, null, null, function(err, hash) {
    if (err) throw err;
    user.password = hash;
    next();
  })
});

// PASSWORD COMPARISON METHOD
UserSchema.methods.comparePassword = function(password) {
  return bycrypt.compareSync(password, this.password);
}


// SESSION SCHEMA
const SessionSchema = new Schema({
  id: {
    type: String,
    required: [true, "ID is required"],
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required:  true,
  },
  description: {
    type: String,
  },
  content: {
    type: String
  },
  time: {
    type: String,
    required: true
  }
});

// PASSWORD RESET SCHEMA
const PasswordResetSchema = new Schema({
  token: {
    type: String,
    required: [true, "ID is required"],
    unique: true
  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  time: {
    type: String,
    required: true
  }
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  Session: mongoose.model('Session', SessionSchema),
  PasswordReset: mongoose.model('PasswordReset', PasswordResetSchema)
};
