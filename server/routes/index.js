const path = require("path");
const UserRoutes = require("./user-routes");
const SessionRoutes = require("./session-routes");

const express = require("express");
const route = express.Router();


route.use("/api/user", UserRoutes);

route.use("/api/session", SessionRoutes);

route.get("*", (req, res) => {
	return res.sendFile(path.join(__dirname, "../../client/index.html"));
});

route.use((req, res) => {
	res.type('text/json');
	res.status(404);
	return res.status(404).json('route does not exist');
});

route.use((err, req, res, next) => {
	console.log(err.stack);
	res.status(500);
	return res.status(500).json('Server error');
});

module.exports = route;
