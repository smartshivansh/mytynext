const express = require("express");
const Router = express.Router();

Router.use("/ga", require("./googleAnalytics"));
Router.use("/data", require("./analytics"));
Router.use("/user-data", require("./userAnalytics"));

module.exports = Router;
