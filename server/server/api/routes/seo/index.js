const express = require("express");
const Router = express.Router();

Router.use("/sitemap.xml", require("./rootSitemap"));
Router.use("/users/subdomain.xml", require("./usersSitemap"));
Router.use("/users/blogs.xml", require("./blogsSitemap"));

module.exports = Router;
