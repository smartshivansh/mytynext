const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const config = require("config");

AWS.config.update({
  secretAccessKey: config.get("secretAccessKey"),
  accessKeyId: config.get("accessKeyId"),
  region: config.get("region"),
});

const localVideoStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    // console.log("Locating destination");
    callback(null, "uploads/");
  },

  filename: (req, file, callback) => {
    console.log(
      "Naming file",
      `${req.user.id}-${file.fieldname}-${Date.now()}${path.extname(
        file.originalname
      )}`
    );

    callback(
      null,
      `${req.user.id}-${file.fieldname}-${Date.now()}${path.extname(
        file.originalname
      )}`
    );
  },
});

const S3 = new AWS.S3();
const s3VideoStorage = multerS3({
  s3: S3,
  acl: "public-read",
  bucket: "mytyver1.0",

  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    cb(
      null,
      `${req.user.id}/${file.fieldname}-${Date.now()}${path.extname(
        file.originalname
      )}`
    );
  },
});

const videoFileFilter = (req, file, callback) => {
  const filetypes = /mp4|mpeg|mov/; // ! more supported file types to add
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // mimetype does not have any values
  // const mimetype = filetypes.test(file.mimetype);

  if (extname) {
    console.log("Successful typecheck");
    return callback(null, true);
  } else {
    console.log("Invalid type for requested media");
    callback("not a video");
  }
};

const fileSizeLimitMB = 1024 * 1024 * 500; // 500 MB

const localVideoUpload = multer({
  fileFilter: videoFileFilter,
  storage: localVideoStorage,
  limits: {
    fileSize: fileSizeLimitMB,
    files: 5,
  },
});

const s3VideoUpload = multer({
  fileFilter: videoFileFilter,
  storage: s3VideoStorage,
  limits: {
    fileSize: fileSizeLimitMB,
    files: 5,
  },
});

function uploadVideoMiddleware(req, res, next) {
  let upload;
  if (
    config.get("env") === "dev" ||
    config.get("env") === "DEV" ||
    config.get("env") === "develeopment"
  ) {
    upload = localVideoUpload.array("video");
  } else {
    upload = s3VideoUpload.array("video");
  }

  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      res.status(400).send("LIMIT_ERROR");
    } else {
      next();
    }
  });
}

module.exports = { localVideoUpload, s3VideoUpload, uploadVideoMiddleware };
