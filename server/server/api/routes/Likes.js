const express = require("express");
const router = express.Router();
const { likeModel, likesModel } = require("../../../models/Like");
const imagePost = require("../../../models/ImagePostSchema");
const linkPost = require("../../../models/LinkPostSchema");
const quotePost = require("../../../models/QuotePostSchema");
const videoPost = require("../../../models/VideoPostSchema");
const blogPost = require("../../../models/BlogSchema");

router.post("/:userId/:postId", async (req, res) => {
  // console.log("req.params", req.params);
  // console.log("query parameters", req.query);

  const { userId, postId } = req.params;
  // console.log("postId & userId", userId, postId);
  // const like = await likeModel({ userId });
  const like = { userId };
  // const likes = await likesModel({ postId });

  const likeSaved = await likesModel.findOneAndUpdate(
    { postId },
    { $addToSet: { likes: like } },
    { new: true, upsert: true }
  );
  console.log("Done", likeSaved);

  console.log("req.query.type", req.query.type, req.query.postId);
  switch (req.query.type) {
    case "LINK":
      const linkData = await linkPost.findByIdAndUpdate(
        { _id: req.query.postId },
        { likes: likeSaved._id },
        { new: true }
      );
      console.log("data in linkData ", linkData);
      console.log("LINK is ran");
      break;
    case "IMAGE":
      const imageData = await imagePost
        .findByIdAndUpdate(
          { _id: req.query.postId },
          { likes: likeSaved._id },
          { new: true }
        )
        .populate("likes");
      console.log("data in imageData ", imageData);
      console.log("IMAGE is ran");
      break;
    case "BLOG":
      const blogData = await blogPost.findByIdAndUpdate(
        { _id: req.query.postId },
        { likes: likeSaved._id },
        { new: true }
      );
      console.log("data in blogData ", blogData);
      console.log("BLOG is ran");
      break;
    case "QUOTE":
      const quoteData = await quotePost.findByIdAndUpdate(
        { _id: req.query.postId },
        { likes: likeSaved._id },
        { new: true }
      );
      console.log("data in imageData ", quoteData);
      console.log("QUOTE is ran");
      break;
    case "VIDEO":
      const videoData = await videoPost.findByIdAndUpdate(
        { _id: req.query.postId },
        { likes: likeSaved._id },
        { new: true }
      );
      console.log("data in imageData ", videoData);
      console.log("VIDEO is ran");
      break;
    default:
      console.log("default is ran");
  }

  const know = await likesModel.find({ postId });
  console.log("find in post Id ", know);
});
module.exports = router;
