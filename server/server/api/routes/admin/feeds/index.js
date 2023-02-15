const express = require("express");
const analyticsAuth = require("../analytics.middleware");
const {
  getBlogs,
  addToFeeds,
  removeFromFeeds,
} = require("./feeds.blogs.controller");
const { validateParams } = require("./feeds.blogs.validatior");

const Router = express.Router();

Router.get("/", async (req, res) => {
  const { orderBy, desec, limit, page } = req.query;
  try {
    const { valid, params } = validateParams(orderBy, desec, limit, page);
    if (valid) {
      const publishedBlogs = await getBlogs({ ...params });
      res.send({
        msg: "route /api/analytics/feeds home",
        additional_info: {},
        results: publishedBlogs,
      });
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

Router.put("/add/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const added = await addToFeeds(id);
    res.send({
      msg: "route /api/analytics/feeds/add/:id home",
      additional_info: {},
      result: added,
    });
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
});

Router.put("/remove/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const removed = await removeFromFeeds(id);
    res.send({
      msg: "route /api/analytics/feeds/remove/:id home",
      additional_info: {},
      result: removed,
    });
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
});

module.exports = Router;
