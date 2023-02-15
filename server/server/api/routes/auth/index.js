const express = require("express");
const Router = express.Router();

const signupRouter = require("./signup");
Router.use("/signup", signupRouter);
Router.use("/login", require("./login"));

// const recaptchaRouter = require("./recaptcha");

module.exports = Router;
