const express = require("express");
const { MulterError } = require("multer");
const {
  localVideoUpload,
  s3VideoUpload,
  uploadVideoMiddleware,
} = require("./video-post.middleware");
const server = require("../../../../server");
const auth = require("../../../../middleware/auth");
const mediaVideo = require("../../../../models/MediaVideoSchema");
const videoPost = require("../../../../models/VideoPostSchema");
const deletedMedia = require("../../../../models/DeletedMediaSchema");
const { ObjectId } = require("mongodb");
const config = require("config");
const multer = require("multer");
const bodyParser = require("body-parser");
const urlEncodedParser = bodyParser.urlencoded({ extended: true });

const Router = express.Router();

const dev = () => {
  if (
    config.get("env") === "dev" ||
    config.get("env") === "DEV" ||
    config.get("env") === "development"
  ) {
    return true;
  } else {
    return false;
  }
};
// let upload;
// if (dev) {
//   upload = localVideoUpload.array("video");
// } else {
//   upload = s3VideoUpload.array("video");
// }

Router.post("/videos", auth, uploadVideoMiddleware, async (req, res) => {
  console.log("Videos Coming...");

  let filePaths = [],
    videos = [];
  // upload(req, res, async (err) => {
  //   if (err instanceof MulterError) {
  //     res.status(400).send("LIMIT_ERROR");
  //   } else {
  //     const videos = [];
  //     req.files.forEach((file) => {
  //       let path;
  //       if (dev) {
  //         path = `${server.Url}/${file.destination}${file.filename}`;
  //       } else {
  //         path = file.location;
  //       }
  //       console.log(path);
  //       filePaths.push(path);
  //       videos.push({ src: path });
  //     });
  //     const videosRefs = await mediaVideo.insertMany(videos);
  //     res.status(200).send({ path: filePaths, refs: videosRefs });
  //   }
  // });

  try {
    req.files.forEach((file) => {
      let path;
      if (dev()) {
        path = `${server.Url}/${file.destination}${file.filename}`;
      } else {
        path = file.location;
      }
      console.log(path);
      filePaths.push(path);
      videos.push({ src: path });
    });
    const videosRefs = await mediaVideo.insertMany(videos);
    res.status(200).send({ path: filePaths, refs: videosRefs });
  } catch (error) {
    res.status(400).send(error);
  }
});

Router.post("/video-link", auth, async (req, res) => {
  const { video } = req.body;
  console.log(video);

  const videoRef = await mediaVideo({ src: video });
  const savedVideoRef = await videoRef.save();
  res.status(200).send({ ref: savedVideoRef });
});

Router.delete("/videos/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedVideo = await mediaVideo.findByIdAndDelete(id);

    const deleted = await deletedMedia({ deleted: deletedVideo });
    deleted.save();

    res.status(200).send({
      video: deletedVideo,
    });
  } catch (err) {
    res.status(400).send("DELETE_FAILED");
  }
});

Router.patch("/videos/:id/create-thumb", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const foundVideo = await mediaVideo.findById(new ObjectId(id));
    res.status(200).send({ id, status: "ok", video: foundVideo });
  } catch (error) {
    res.status(400).send({ msg: "THUMB_FAILED", err: error.message });
  }
});

Router.post("/", auth, async (req, res) => {
  const data = req.body;
  console.log(data);
  // TODO dto handling
  const created = await videoPost(data);
  try {
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
  console.log(data);
  try {
    const updated = await videoPost.findByIdAndUpdate(id, data);
    res.status(202).send(updated);
  } catch (err) {
    res.status(400).send("UPDATE_FAILED");
  }
});

Router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await videoPost.findByIdAndRemove(id);
    const videoCount = deletedPost.videos.length;

    const deleted = await deletedMedia({ deleted: deletedPost });
    deleted.save();

    res.status(200).send({ msg: `${videoCount} images deleted.` });
  } catch (error) {
    res.sendStatus(400).send("DELETE_FAILED");
  }
});

Router.get("/findby-user/:id", async (req, res) => {
  const user_id = req.params.id;
  const found = await videoPost
    .find({ user_id })
    .populate("videos")
    .populate("likes");
  res.status(200).send({ results: found });
});

Router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const found = await videoPost.findById(id).populate("videos");
  res.status(200).send({ result: found });
});

module.exports = Router;
