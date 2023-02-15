const express = require("express");
const LinkPost = require("../../../../models/LinkPostSchema");
const Router = express.Router();
const getMetaData = require("metadata-scraper");

Router.post("/link-data", async function (req, res) {
  const { link } = req.body;
  console.log(link);

  const data = await getMetaData(link);
  res.status(200).send({ ...data });
});

Router.post("/", async function (req, res) {
  const data = req.body;
  console.log(data);
  const created = await LinkPost(data).save();
  res.status(201).send({ result: created });
});

Router.get("/", (req, res) => {
  res.sendStatus(200);
});

Router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const found = await LinkPost.findById(id);
  res.status(200).send({ result: found });
});

Router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const { link, metadata, private } = data;
  try {
    console.log({ link, metadata });
    const updated = await LinkPost.findByIdAndUpdate(id, { link, metadata, private });
    res.status(202).send(updated);
  } catch (error) {
    res.status(400).send("UPDATE_FAILED");
  }
});

Router.get("/findby-user/:id", async (req, res) => {
  const user_id = req.params.id;
  const found = await LinkPost.find({ user_id }).populate("likes");

  res.status(200).send({ results: found });
});

Router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await LinkPost.findByIdAndRemove(id);
    res.status(200).send({ msg: `Link Card of ${deletedPost._id} deleted.` });
  } catch (error) {
    res.sendStatus(400).send("DELETE_FAILED");
  }
});

module.exports = Router;
