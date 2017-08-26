const path = require("path");
const userroutes = require("./userroutes");
const sessionroutes = require("./sessionroutes");

const express = require("express");
const route = express.Router();

route.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "./../../template/session.html"));
});

route.use("/api/users", userroutes);

route.use("/api/sessions", sessionroutes);

route.use((req, res) => {
	res.type('text/json');
	res.status(404);
	return res.json('route do not exist');
});

route.use((err, req, res, next) => {
	console.log(err.stack);
	res.status(500);
	return res.json('Server error');
});

module.exports = route;