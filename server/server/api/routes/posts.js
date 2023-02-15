const express = require("express");
const path = require("path");
const multer = require("multer");

const router = express.Router();
const auth = require("../../../middleware/auth");

// for a complete post use Post Schema not Image
const Image = require("../../../models/Image");
const Post = require("../../../models/Post");
const TextDb = require("../../../models/TextDb");
const mongoose = require("mongoose");

// router.post("/post", auth, (req, res) => {
//   const data = req.body;
//   // use post in General
//   const newPost = new Post({
//     _id: new mongoose.Types.ObjectId(),
//     user: data.user,
//     title: data.title,
//     article: data.article,
//     images: data.images,
//   });

//   try {
//     newPost.save();

//     res.status(200).json({
//       message: `posted successfully`,
//       newPost: newPost,
//     });
//   } catch (error) {
//     res.status(401).json({ message: "error in saving images" });
//   }
// });

// router.get("/posts", async (req, res) => {
//   const posts = await Post.find({});
//   res.status(200).send({
//     message: `at route /api/posts/`,
//     posts: posts,
//   });
// });

// router.get("/postsby/:userId", async (req, res) => {
//   const userId = req.params.userId;
//   // console.log(userId);
//   const posts = await Post.find({ "user._id": userId });
//   // console.log(posts);
//   res.status(200).send({
//     message: `dynamic route with request parameter userId: ${userId}`,
//     posts: posts,
//   });
// });

// router.get("/post/:postId", (req, res) => {
//   const postId = req.params.postId;
//   res.status(200).send({
//     message: `dynamic route with request parameter: ${postId}`,
//   });
// });

//from rich text editor
// router.post("/post/richtext", auth, async (req, res) => {
//   console.log("!!12", req.user, req.body);
//   const text = new TextDb({
//     user: req.user.id,
//     text: req.body.contentDb,
//     title: req.body.title,
//   });
//   await text.save();
//   res.send("text saved");
// });

// router.get("/getrichtext", auth, async (req, res) => {
//   // console.log("!!34", req.user);
//   const text = await TextDb.find({ user: req.user.id });
//   // console.log(text);
//   if (text) {
//     res.status(200).json(text);
//   }
// });

// router.get("/blogsby/:userId", async (req, res) => {
//   const userId = req.params.userId;
//   const blogs = await TextDb.find({ user: userId });
//   // console.log(blogs);
//   if (blogs) {
//     res.status(200).json({
//       blogs: blogs,
//     });
//   }
// });

// router.get("/blog/:blogId", async (req, res) => {
//   console.log("!!56", req.params.blogId);

//   try {
//     const blog = await TextDb.findById(req.params.blogId);
//     if (blog) {
//       res.status(200).json(blog);
//     }
//   } catch (error) {
//     res.status(400).json({ error: error });
//   }
// });

module.exports = router;
