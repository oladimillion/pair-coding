const express = require("express");
const route = express.Router();

const userctrl = require("../controllers/userctrl");

const {
	signin,
	signup
} = userctrl;


// route.get("/", (req, res) => {
// 	return res.send("testing user routes");
// });

// USERS AUTHENTICATION
route.post('/signin', signin);


// USERS REGISTRATION
route.post('/signup', signup);


module.exports = route;