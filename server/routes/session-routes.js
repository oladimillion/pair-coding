const express = require("express");
const route = express.Router();

const sessionctrl = require("../controllers/session-ctrl");
const  authenticate  = require("../middlewares/authenticate");

const {
  create, fetchOne, fetchAll,	updateSession, updateSessionDetail, deleteSession
} = sessionctrl;


route.post("/create", authenticate, create);

route.get("/fetch-one/:id", authenticate, fetchOne);

route.get("/fetch-all", authenticate, fetchAll);

route.put("/update-session", authenticate, updateSession);

route.put("/update-session-detail", authenticate, updateSessionDetail);

route.delete("/delete-session/:id", authenticate, deleteSession);

module.exports = route;
