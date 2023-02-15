const express = require("express");
const { ObjectId } = require("mongoose").Types;
const Router = express.Router();

const videoPost = require("../../../../../models/VideoPostSchema");
const mediaVideo = require("../../../../../models/MediaVideoSchema");
const deletedMedia = require("../../../../../models/DeletedMediaSchema");
const user = require("../../../../../models/User");

Router.get("/video-posts", async (req, res) => {
  res.send(await videoPost.find({}));
});

Router.get("/video-posts-with-source", async (req, res) => {
  res.send(await videoPost.find({}).populate("videos"));
});

Router.get("/video-medias", async (req, res) => {
  res.send(await mediaVideo.find({}));
});

Router.get("/deleted-medias", async (req, res) => {
  res.send(await deletedMedia.find({ "deleted.type": "VIDEO" }));
});

Router.get("/allposts-byuser", async (req, res) => {
  const queryBy = req.query;
  // const { userId, name, username, subdomain } = queryBy;
  // const query = {};
  // Object.keys(queryBy).forEach((key) => {
  //   if (queryBy[key]) {
  //     if (key === "userId") {
  //       query["_id"] = new ObjectId(queryBy[key]);
  //     } else {
  //       query[key] = queryBy[key];
  //     }
  //   }
  // });
  const query = genereateQuery(queryBy);

  // ! a aggrigation pipeline to be made
  // const aggData = await user
  //   .aggregate()
  //   .match(query)
  //   .lookup({
  //     from: "temp_videoposts",
  //     localField: "_id",
  //     foreignField: "user_id",
  //     as: "posts",
  //   })
  //   .lookup({
  //     from: "temp_mediavideos",
  //     localField: "posts.videos",
  //     foreignField: "_id",
  //     as: "posts.videos",
  //   })
  //   .project({
  //     username: 1,
  //     name: 1,
  //     subdomain: 1,
  //     posts: 1,
  //   });

  // aggData.forEach((el) => {
  //   const user = {
  //     _id: el._id,
  //     name: el.name,
  //     username: el.username,
  //     subdomain: el.subdomain,
  //   };
  //   const video_src = el.posts.videos.map((video) => {
  //     return video.src;
  //   });
  //   data.push({ user, video_src });
  // });
  const data = await getAggregatedVideoByUser(query);

  res.send({
    query,
    data,
    // aggData,
    // users,
    // posts,
  });
});

Router.get("/");

module.exports = Router;
