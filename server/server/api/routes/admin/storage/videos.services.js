const { ObjectId } = require("mongoose").Types;

const videoPost = require("../../../../../models/VideoPostSchema");
const mediaVideo = require("../../../../../models/MediaVideoSchema");
const deletedMedia = require("../../../../../models/DeletedMediaSchema");
const user = require("../../../../../models/User");

function genereateQuery(queryBy) {
  const { userId, name, username, subdomain } = queryBy;
  let query = {};
  Object.keys(queryBy).forEach((key) => {
    if (queryBy[key]) {
      if (key === "userId") {
        query["_id"] = new ObjectId(queryBy[key]);
      } else {
        query[key] = queryBy[key];
      }
    }
  });
  return query;
}

function getAggregatedVideoByUser(query) {
  let data = [];

  const aggData = await user
    .aggregate()
    .match(query)
    .lookup({
      from: "temp_videoposts",
      localField: "_id",
      foreignField: "user_id",
      as: "posts",
    })
    .lookup({
      from: "temp_mediavideos",
      localField: "posts.videos",
      foreignField: "_id",
      as: "posts.videos",
    })
    .project({
      username: 1,
      name: 1,
      subdomain: 1,
      posts: 1,
    });

  aggData.forEach((el) => {
    const user = {
      _id: el._id,
      name: el.name,
      username: el.username,
      subdomain: el.subdomain,
    };
    const video_src = el.posts.videos.map((video) => {
      return video.src;
    });

    data.push({ user, video_src });
  });

  return data;
}

module.exports = { genereateQuery, getAggregatedVideoByUser };
