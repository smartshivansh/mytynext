const express = require("express");
const { MulterError } = require("multer");
const {
  localImageUpload,
  s3ImageUpload,
  uploadImageMiddleware,
} = require("./image-post.middleware");
const server = require("../../../../server");
const auth = require("../../../../middleware/auth");
const mediaImage = require("../../../../models/MediaImageSchema");
const imagePost = require("../../../../models/ImagePostSchema");
const deletedMedia = require("../../../../models/DeletedMediaSchema");
const config = require("config");
const axios = require("axios");

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
//   upload = localImageUpload.array("image");
// } else {
//   upload = s3ImageUpload.array("image");
// }

Router.post("/images", auth, uploadImageMiddleware, async (req, res) => {
  let filePaths = [],
    images = [];
  // upload(req, res, async (err) => {
  //   if (err instanceof MulterError) {
  //     res.status(400).send("LIMIT_ERROR");
  //   } else {
  //     const images = [];
  //     req.files.forEach((file) => {
  //       let path;
  //       if (dev) {
  //         path = `${server.Url}/${file.destination}${file.filename}`;
  //       } else {
  //         path = file.location;
  //       }
  //       // console.log(path);
  //       filePaths.push(path);
  //       images.push({ src: path });
  //     });
  //     const imagesRefs = await mediaImage.insertMany(images);
  //     res.status(200).send({ path: filePaths, refs: imagesRefs });
  //   }
  // });

  try {
    // console.log(req.files);
    req.files.forEach((file) => {
      // console.log("uploaded file", file);
      let path;
      if (dev()) {
        path = `${server.Url}/${file.destination}${file.filename}`;
      } else {
        path = file.location;
      }
      filePaths.push(path);
      images.push({ src: path });
    });
    const imagesRefs = await mediaImage.insertMany(images);

    // // queue all images to be converted to webp
    // try {
    //   console.log("Sending for compression");
    //   const compressionRes = await axios.post(
    //     "http://localhost:8085/compress-images",
    //     {
    //       images: imagesRefs,
    //     }
    //   );
    //   console.log(compressionRes.data);
    //   console.log("Sent for compression");
    // } catch (error) {
    //   console.log("Error while sending comression", error);
    // }

    res.status(200).send({ path: filePaths, refs: imagesRefs });
  } catch (error) { }
});

Router.post("/image-link", auth, async (req, res) => {
  const { image } = req.body;

  const imageRef = await mediaImage({ src: image });
  imageRef.save();
  res.status(200).send({ ref: imageRef });
});

Router.delete("/images/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedImage = await mediaImage.findByIdAndDelete(id);
    const deleted = await deletedMedia({ deleted: deletedImage });
    deleted.save();

    res.status(200).send({
      image: deletedImage,
    });
  } catch (err) {
    res.status(400).send("DELETE_FAILED");
  }
});

Router.post("/images/add-thumb", async (req, res) => {
  const { src, files } = req.body;
  // console.log(body);
  const _src = files.uploadedOriginalFile ?? src;
  const _thumb = files.uploadedFile;
  console.log(_src, _thumb);
  try {
    const updatedImage = await mediaImage.findOneAndUpdate(
      { src },
      { src: _src, thumb: _thumb },
      { upsert: true, new: true }
    );

    res.status(200).send(updatedImage);
  } catch (error) {
    res.status(400).send(error);
  }
});

Router.post("/", auth, async (req, res) => {
  const data = req.body;
  console.log(data);
  // TODO dto handling
  const created = await imagePost(data);
  try {
    created.save();
    res.sendStatus(201);
  } catch (err) { }
});

Router.get("/", (req, res) => {
  res.sendStatus(200);
});

Router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updated = await imagePost.findByIdAndUpdate(id, data);
    res.status(202).send(updated);
  } catch (err) {
    res.status(400).send("UPDATE_FAILED");
  }
});

Router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await imagePost.findByIdAndRemove(id);
    const imageCount = deletedPost.images.length;

    const deleted = await deletedMedia({ deleted: deletedPost });
    deleted.save();

    res.status(200).send({ msg: `${imageCount} images deleted.` });
  } catch (error) {
    res.sendStatus(400).send("DELETE_FAILED");
  }
});

Router.get("/findby-user/:id", async (req, res) => {
  const user_id = req.params.id;
  const found = await imagePost
    .find({ user_id })
    .populate("images")
    .populate("likes");
  res.status(200).send({ results: found });
});

Router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const found = await imagePost.findById(id).populate("images");
  res.status(200).send({ result: found });
});

module.exports = Router;
