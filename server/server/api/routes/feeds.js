const express = require("express");
const mongoose = require("mongoose");
const Blog = require("../../../models/BlogSchema");
const Image = require("../../../models/ImagePostSchema");
const Video = require("../../../models/VideoPostSchema");
const Quote = require("../../../models/QuotePostSchema");
const Link = require("../../../models/LinkPostSchema");
const feed = require("../../../models/feeds");
const user = require("../../../models/User");
const profilecard = require("../../../models/ProfileCardSchema");
const { BLOG, IMAGE, VIDEO } = require("../../../utils/feeds/feedsHelper");
const router = express.Router();

router.post("/fullfeeds", async (req, res) => {
  const { page } = req.body;
  console.log("inside fullfeeds ", page);
  const limit = 50;
  try {
    const resultBlogs = Blog.find({ published: true, drafted: false })
      .sort({ updatedAt: -1 })
      .populate("user_id", {
        name: 1,
        subdomain: 1,
        image_url: 1,
        image_url_compress: 1,
      })
      .limit(limit)
      .skip((page - 1) * limit);

    const resultImage = Image.find({ published: true })
      .sort({ updatedAt: -1 })
      .populate("images")
      .populate("user_id", {
        name: 1,
        subdomain: 1,
        image_url: 1,
        image_url_compress: 1,
      })
      .limit(limit)
      .skip((page - 1) * limit);

    const resultVideo = Video.find({ published: true })
      .sort({ updatedAt: -1 })
      .populate("videos")
      .populate("user_id", {
        name: 1,
        subdomain: 1,
        image_url: 1,
        image_url_compress: 1,
      })
      .limit(limit)
      .skip((page - 1) * limit);

    const resultQuote = Quote.find({ published: true })
      .sort({ updatedAt: -1 })
      .populate("user_id", {
        name: 1,
        subdomain: 1,
        image_url: 1,
        image_url_compress: 1,
      })
      .limit(limit)
      .skip((page - 1) * limit);

    const resultLink = Link.find({ published: true })
      .sort({ updatedAt: -1 })
      .populate("user_id", {
        name: 1,
        subdomain: 1,
        image_url: 1,
        image_url_compress: 1,
      })
      .limit(limit)
      .skip((page - 1) * limit);

    const [blog, image, video, quote, link] = await Promise.all([
      resultBlogs,
      resultImage,
      resultVideo,
      resultQuote,
      resultLink,
    ]);

    res.send({
      msg: "full Feeds",
      results: { image },
    });
  } catch (error) {
    console.log("error", error.message);
  }
});

router.get("/newfeed", async (req, res) => {
  console.log("inside newfeeds ");
  const limit = 5;

  try {
    const profilecardData = await Blog.find({});
    const data1 = await Blog.findOneAndUpdate(
      { _id: profilecardData[0]._id },
      {
        updatedAt: new Date(profilecardData[0].last_update_date),
      },
      { new: true }
    );

    res.send({ msg: "done" });
  } catch (error) {
    console.log("error", error);
  }
});

router.post("/add", async (req, res) => {
  feed.findOneAndUpdate(
    { _id: "6209f701bfd26938f3161f28" },
    { $push: { feeds: req.body } },
    { upsert: true, new: true },
    function (error, success) {
      if (error) {
        console.log(error);
      } else {
        // console.log(success);
        res.status(200).send({ msg: "success", data: success.feeds.length });
      }
    }
  );
});

router.post("/remove", async (req, res) => {
  feed.findOneAndUpdate(
    { _id: "6209f701bfd26938f3161f28" },
    { $pull: { feeds: req.body } },
    { upsert: true, new: true },
    function (error, success) {
      if (error) {
        console.log(error);
      } else {
        // console.log(success);
        res.status(200).send({ msg: "success", data: success.feeds.length });
      }
    }
  );
});

router.post("/add-with-query", async (req, res) => {
  const query = req.query;
  console.log(
    "query",
    query,
    query.action ? { $pull: { feeds: "data" } } : { $push: { feeds: "data" } }
  );

  switch (query.type) {
    case "BLOG":
      const blog = await BLOG(query.data, query?.action);

      res.status(200).send({ msg: "success", data: blog.feeds.length });
      // data && res.status(200).send({ msg: "success", data: data[0].feeds[0] });
      break;
    case "IMAGE":
      const image = await IMAGE(query.data, query?.action);
      res.status(200).send({ msg: "success", data: image.feeds.length });
      // res.status(200).send({ msg: "success", data: image.feeds.length });
      break;
    case "VIDEO":
      const video = await VIDEO(query.data, query?.action);
      res.status(200).send({ msg: "success", data: video.feeds.length });
      // res.status(200).send({ msg: "success", data: video.feeds.length });
      break;
    default:
      res
        .status(200)
        .send({ msg: "fail", data: "no data | you entered wrong query" });
  }
});

module.exports = router;
