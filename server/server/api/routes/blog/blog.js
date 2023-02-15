const express = require("express");
const mongoose = require("mongoose");
const { customFeeds } = require("../../../../data.js");
const router = express.Router();

const auth = require("../../../../middleware/auth");

const Blog = require("../../../../models/BlogSchema");
const Image = require("../../../../models/ImagePostSchema");
const Video = require("../../../../models/VideoPostSchema");
const Quote = require("../../../../models/QuotePostSchema");
const Link = require("../../../../models/LinkPostSchema");
const User = require("../../../../models/User");
const redis = require("redis");
const feeds = require("../../../../models/feeds.js");

const redisClient = redis.createClient();

// const channel = "status";

// redisClient.subscribe(channel, (error, channel) => {
//   if (error) {
//     throw new Error(error);
//   }
//   console.log(
//     `Subscribed to ${channel} channel. Listening for updates on the ${channel} channel...`
//   );
// });

// redisClient.on("message", (channel, message) => {
//   console.log(`Received message from ${channel} channel: ${message}`);
// });

redisClient.on("error", (err) => {
  console.log("redis did not connect 🚨/blogs\n", err.message);
  redisClient.quit();
});

redisClient.on("connect", () => {
  console.log("Redis  Connected.👍");
});
redisClient.on("reconnecting", () => {
  console.log("Redis reconnecting 🔁");
});

const DEFAULT_EXPIRATION = 900;

// First Save
router.post("/post/new", auth, async (request, response) => {
  const { blogData } = request.body;

  if (blogData.slug === "") {
    blogData.slug = mongoose.Types.ObjectId();
  }

  // console.log("POST");
  const resultBlog = await Blog(blogData).save();
  // ! Use try-catch for error handling

  response.send({
    message: "posted new item",
    result: resultBlog,
  });
});

// Successive Autosave/Publish
router.put("/put/:type/:id", auth, async (request, response) => {
  const { type, id } = request.params;
  const { blogData } = request.body;
  try {
    if (blogData.slug === "") {
      blogData.slug = mongoose.Types.ObjectId();
    }

    // console.log("PUT");
    if (id) {
      const resultBlog = await Blog.findByIdAndUpdate(id, blogData, { new: true });

      response.send({
        message: "putting new data",
        type,
        id,
        result: resultBlog,
      });
    } else {
      response.send({
        err: "id is null",
      });
    }
  } catch (error) {
    response.status(404).send({
      err: error,
    });
    console.log(error);
  }
});

// Page Reload
router.get("/get/:type/:id", auth, async (request, response) => {
  const { type, id } = request.params;

  if (id !== null) {
    // console.log("GET");
    const resultBlog = await Blog.findById(id);
    // console.log(resultBlog);

    response.send({
      message: "getting item",
      type,
      id,
      result: resultBlog,
    });
  } else {
    response.send({
      message: "id not valid",
      type,
      id,
    });
  }
});

router.get("/getblogs/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  // console.log("getblogs", user_id);

  const result = await Blog.find({ user_id: user_id, published: true }).select(
    "-content_raw"
  );

  res.send({
    msg: "blogs retrieved successfully.",
    result: result,
  });
});

router.get("/getdrafts/:user_id", auth, async (req, res) => {
  const user_id = req.params.user_id;
  // console.log("getdrafts", user_id);

  const result = await Blog.find({ user_id: user_id, drafted: true }).select(
    "-content_raw"
  );

  res.send({
    msg: "drafts retrieved successfully.",
    result: result,
  });
});

router.get("/getblog/:id", async (req, res) => {
  const { id } = req.params;

  const result = await Blog.findById(id);

  res.send({
    msg: "blog retrieved successfully.",
    result: result,
  });
});

router.get("/getblog/:username/:blog_slug", async (req, res) => {
  // console.log("Server endpoint for blog_slug is gettign");
  let { username, blog_slug } = req.params;

  const result = await Blog.findOne({ username: username, slug: blog_slug });

  res.send({
    msg: "blog retrieved successfully.",
    result: result,
  });
});

router.get("/getblog/:id", async (req, res) => {
  // console.log("Server endpoint for blog_slug is gettign");
  let { id } = req.params;

  const result = await Blog.findById(id);

  res.send({
    msg: "blog retrieved successfully.",
    result: result,
  });
});

router.delete("/deleteblog/:blog_id", auth, async (req, res) => {
  const { blog_id } = req.params;

  const resultBlogs = await Blog.findByIdAndRemove(blog_id);
  const resultDeletedtUserId = await resultBlogs.user_id;
  const resultDeletedWasDrafted = await resultBlogs.drafted;
  const resultDeletedWasPublished = await resultBlogs.published;

  const remainingBlogs = await Blog.find({
    user_id: resultDeletedtUserId,
    drafted: resultDeletedWasDrafted,
    published: resultDeletedWasPublished,
  });

  res.send({
    msg: `Deleting blog ${blog_id}`,
    result: remainingBlogs,
  });
});

router.post("/feeds", async (req, res) => {
  const { page } = req.body ?? { page: 1 };
  const { device } = req.query;

  let limit = 5;
  if (device === "mobile") {
    limit = 2;
  }

  try {
    if (page == 0) {
      const result = await getOrSetCache(`feeds?page=${page}`, async () => {
        try {
          const result = await feeds.find({});
          return result[0]?.feeds ? result[0].feeds : [];
        } catch (error) {
          console.log(error);
        }
      });
      res.status(200).send(result);
      return;
    } else {
      const data = await getOrSetCache(`feeds?page=${page}`, async () => {
        const resultBlogs = Blog.find({ published: true, drafted: false })
          .sort({ last_update_date: -1 })
          .populate("user_id", {
            name: 1,
            username: 1,
            subdomain: 1,
            image_url: 1,
            image_url_compress: 1,
          })
          .limit(limit)
          .skip((page - 1) * limit);
        const resultImage = Image.find()
          .sort({ createdAt: -1 })
          .populate("images")
          .populate("user_id", {
            name: 1,
            username: 1,
            subdomain: 1,
            image_url: 1,
            image_url_compress: 1,
          })
          .limit(limit)
          .skip((page - 1) * limit);
        const resultVideo = Video.find()
          .sort({ createdAt: -1 })
          .populate("videos")
          .populate("user_id", {
            name: 1,
            username: 1,
            subdomain: 1,
            image_url: 1,
            image_url_compress: 1,
          })
          .limit(limit)
          .skip((page - 1) * limit);
        const resultQuote = Quote.find()
          .sort({ createdAt: -1 })
          .populate("user_id", {
            name: 1,
            username: 1,
            subdomain: 1,
            image_url: 1,
            image_url_compress: 1,
          })
          .limit(limit)
          .skip((page - 1) * limit);
        const resultLink = Link.find()
          .sort({ createdAt: -1 })
          .populate("user_id", {
            name: 1,
            username: 1,
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

        return [...blog, ...image, ...video, ...quote, ...link];
        // this is the place where the feed gets returned...important bookmark by - Anurag Jain
      });
      res.status(200).send(data);
    }
  } catch (error) {
    console.log("error", error.message);
  }
});

function getOrSetCache(key, cb) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (error, data) => {
      if (error) {
        // console.log("error ran inside redisClient");
        const freshData = await cb();
        return resolve(freshData);
      }
      // console.log("did i went after error");
      if (data != null) {
        console.log("Cache Hit");
        return resolve(JSON.parse(data));
      }
      const freshData = await cb();
      console.log("Cache Miss");
      redisClient.setex(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
      resolve(freshData);
    });
  });
}

module.exports = router;
