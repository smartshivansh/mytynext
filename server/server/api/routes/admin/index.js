const express = require("express");
const jwt = require("jsonwebtoken");
const analyticsAuth = require("./analytics.middleware");

const Router = express.Router();

const analyticsAdmin = {
  secret: "secret-for-analytics-token",
  // ! super scetchy username : must handle some other way later
  user: {
    username: "mYtY-@Dm1N",
    password: "mYtY-@Dm1N",
  },
};

//
Router.use("/storage", require("./storage"));
//

Router.get("/", (req, res) => {
  res.send({
    msg: "route /api/analytics home",
  });
});

Router.use("/feeds", analyticsAuth, require("./feeds/index"));

Router.get("/access", (req, res) => {
  const token = jwt.sign(analyticsAdmin.user, analyticsAdmin.secret, {
    expiresIn: "5m",
  });

  res.send({ token });
});

Router.get("/revoke", (req, res) => {});

module.exports = Router;
