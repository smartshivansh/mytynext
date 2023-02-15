const express = require("express");
const Router = express.Router();

const instanceHandlerRoute = require("./instance.controller");
Router.use("/instance", instanceHandlerRoute);

module.exports = Router;
