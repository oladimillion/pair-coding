const express = require("express");
const route = express.Router();

const sessionctrl = require("../controllers/sessionctrl");

const {
	create,
	open,
	update
} = sessionctrl;


// route.get("/", (req, res) => {
// 	return res.send("testing session routes");
// });

route.post('/create', create);

route.post('/open', open);

route.post('/update', update);


module.exports = route;