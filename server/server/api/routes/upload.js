const path = require("path");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const server = require("../../../server");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const config = require("config");
const auth = require("../../../middleware/auth");
const mytyBot = require("../../../middleware/mytyBot");

AWS.config.update({
  secretAccessKey: config.get("secretAccessKey"),
  accessKeyId: config.get("accessKeyId"),
  region: config.get("region"),
});

const S3 = new AWS.S3();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkImageFileType(file, cb) {
  const filetypes = /jpg|png|jpeg|svg|jfif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Post Image Only!");
  }
}

function checkVideoFileType(file, cb) {
  const filetypes = /mp4|mov|avi/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Post Videos Only!");
  }
}

const uploadImage = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkImageFileType(file, cb);
  },
});

const uploadVideo = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkVideoFileType(file, cb);
  },
});

const uploadImageAWS = multer({
  storage: multerS3({
    s3: S3,
    acl: "public-read",
    bucket: "mytyver1.0",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
  fileFilter: function (req, file, cb) {
    checkImageFileType(file, cb);
  },
});

const uploadVideoAWS = multer({
  storage: multerS3({
    s3: S3,
    acl: "public-read",
    bucket: "mytyver1.0",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
  limits: {
    fieldSize: 10 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    checkVideoFileType(file, cb);
  },
});

router.post("/image", uploadImage.single("image"), (req, res) => {
  console.log("heyy file" + req.file)
  let filePath = `${server.Url}/${req.file.destination}${req.file.filename}`;
  console.log(filePath);
  // mytyBot(req.url, "", "image uploaded successfully");
  res.send({
    message: `image uploaded successfully`,
    path: filePath,
  });
});

router.post("/images", auth, uploadImage.array("image", 5), (req, res) => {
  let filePaths = [];

  req.files.forEach((file) => {
    filePaths.push(`${server.Url}/${file.destination}${file.filename}`);
  });
  // mytyBot(req.originalUrl, "", "image uploaded successfully");
  res.send({
    message: `images uploaded successfully`,
    path: filePaths,
  });
});

router.post("/videos", auth, uploadVideo.array("video", 5), (req, res) => {
  let filePaths = [];

  req.files.forEach((file) => {
    filePaths.push(`${server.Url}/${file.destination}${file.filename}`);
  });
  console.log(filePaths);
  // mytyBot(req.originalUrl, "", "videos uploaded successfully");
  res.send({
    message: `videos uploaded successfully`,
    path: filePaths,
  });
});

router.post(
  "/images/aws",
  auth,
  uploadImageAWS.array("image", 5),
  (req, res) => {
    let filePaths = [];

    req.files.forEach((file) => {
      filePaths.push(file.location);
    });
    // mytyBot(req.originalUrl, "", "images uploaded successfully");
    res.send({
      message: `images uploaded successfully`,
      path: filePaths,
    });
  }
);

router.post(
  "/videos/aws",
  auth,
  uploadVideoAWS.array("video", 5),
  (req, res) => {
    let filePaths = [];

    req.files.forEach((file) => {
      filePaths.push(file.location);
    });
    // mytyBot(req.originalUrl, "", "videos uploaded successfully");
    res.send({
      message: `videos uploaded successfully`,
      path: filePaths,
    });
  }
);

module.exports = router;
