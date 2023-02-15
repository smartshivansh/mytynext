const express = require("express");
const Router = express.Router();

const setupLinkRouter = require("./setup-link.controller");
Router.use("/setup", setupLinkRouter);

module.exports = Router;
