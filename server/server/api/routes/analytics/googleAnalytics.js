const express = require("express");

const Router = express.Router();

Router.get("/", (req, res) => {
  res.send({ status: "ok" });
});

module.exports = Router;
