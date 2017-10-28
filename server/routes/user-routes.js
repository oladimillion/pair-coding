const express = require("express");
const route = express.Router();

const userctrl = require("../controllers/user-ctrl");
const  authenticate  = require("../middlewares/authenticate");

const { signin, signup, passwordReset, passwordResetLink, 
  profileUpdate, verifyPasswordResetToken } = userctrl;


// USERS AUTHENTICATION
route.post('/signin', signin);


// USERS REGISTRATION
route.post('/signup', signup);

// PASSWORD RESET
route.put('/password-reset', passwordReset);
route.post('/password-reset-link', passwordResetLink);
// VERIY PASSWORD RESET TOKEN
route.post('/password-reset-token/:token', verifyPasswordResetToken);

// PROFILE UPDATE
route.put('/profile-update', authenticate, profileUpdate);


module.exports = route;
