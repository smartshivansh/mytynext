const express = require("express");
const server = require("../../../../server");
const auth = require("../../../../middleware/auth");
const quotePost = require("../../../../models/QuotePostSchema");

const Router = express.Router();

Router.post("/", auth, async (req, res) => {
  const data = req.body;
  console.log(data);
  // TODO dto handling
  try {
    const created = await quotePost(data);
    created.save();
    res.sendStatus(201);
  } catch (err) {}
});

Router.get("/", (req, res) => {
  res.sendStatus(200);
});

Router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updated = await quotePost.findByIdAndUpdate(id, data);
    res.status(200).send(res.data);
  } catch (err) {
    res.status(400).send("UPDATE_FAILED");
  }
});

Router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await quotePost.findByIdAndRemove(id);
    res.status(200).send({ msg: `${deletedPost._id} quote deleted.` });
  } catch (error) {
    res.sendStatus(400).send("DELETE_FAILED");
  }
});

Router.get("/findby-user/:id", async (req, res) => {
  const user_id = req.params.id;
  const found = await quotePost.find({ user_id }).populate("likes");
  res.status(200).send({ results: found });
});

Router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const found = await quotePost.findById(id);
  res.status(200).send({ result: found });
});

module.exports = Router;
