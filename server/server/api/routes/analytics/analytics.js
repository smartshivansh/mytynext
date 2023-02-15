const express = require("express");
const signup = require("../../../../models/Signup");
const user = require("../../../../models/User");
const online = require("../../../../models/AdminOnlineUsers");
const blog = require("../../../../models/BlogSchema");
const image = require("../../../../models/ImagePostSchema");
const link = require("../../../../models/LinkPostSchema");
const quote = require("../../../../models/QuotePostSchema");
const video = require("../../../../models/VideoPostSchema");
const auth = require("../../../../middleware/auth");

const Router = express.Router();

Router.get("/", auth, async (req, res) => {
  let pipeline = [
    {
      $group: {
        _id: null,
        data: { $sum: 1 },
      },
    },
  ];
  const onlinedata = await online.aggregate([
    { $match: { Userstatus: "online" } },
    {
      $group: {
        _id: null,
        data: { $sum: 1 },
      },
    },
  ]);
  const signupdata = await signup.aggregate(pipeline);
  const userdata = await user.aggregate(pipeline);
  const blogdata = await blog.aggregate(pipeline);
  const imagedata = await image.aggregate(pipeline);
  const linkdata = await link.aggregate(pipeline);
  const quotedata = await quote.aggregate(pipeline);
  const videodata = await video.aggregate(pipeline);
  const signupsByDate = await signup.aggregate([
    {
      $match: {
        created_at: {
          $exists: true,
          $ne: null,
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
        created: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const signupsByNewDate = await signup.aggregate([
    {
      $match: {
        updatedAt: {
          $exists: true,
          $ne: null,
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
        created: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  // console.log("signup By Date", signupsByDate);

  // console.log(
  //   "data received from database",
  //   signupdata[0],
  //   userdata[0],
  //   onlinedata[0],
  //   blogdata[0],
  //   imagedata[0],
  //   linkdata[0],
  //   quotedata[0],
  //   videodata[0]
  // );
  res.status(200).send({
    signup: signupdata[0],
    user: userdata[0],
    online: onlinedata[0],
    blog: blogdata[0],
    image: imagedata[0],
    link: linkdata[0],
    quote: quotedata[0],
    video: videodata[0],
    signupsByDate,
    signupsByNewDate,
  });
});

module.exports = Router;
