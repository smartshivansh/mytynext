const express = require("express");
const Router = express.Router();

Router.get("/", (req, res) => {
  res.send("admin storage");
});

Router.use("/videos", require("./videos"));
Router.use("/rename-videos", require("./rename-videos"));

module.exports = Router;
