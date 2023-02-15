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

const localImageStorage = multer.diskStorage({
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
const bucket = config.get("bucketName") ?? "mytyver1.0";
const s3ImageStorage = multerS3({
  s3: S3,
  acl: "public-read",
  bucket: bucket,
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

const imageFileFilter = (req, file, callback) => {
  console.log("In Image File filter");
  const filetypes = /jpg|jpeg|png|webp/; // ! more supported file types to add
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    // console.log("Successful type");
    return callback(null, true);
  } else {
    // console.log("Invalid type");
    callback("not a image");
  }
};

// const fileSizeLimitMB = 1024 * 1024 * 50; // x MB
const fileNumberLimit = 10; // 10 files per upload

const localImageUpload = multer({
  fileFilter: imageFileFilter,
  storage: localImageStorage,
  limits: {
    // fileSize: fileSizeLimitMB, // inifinity
    files: fileNumberLimit,
  },
});

const s3ImageUpload = multer({
  fileFilter: imageFileFilter,
  storage: s3ImageStorage,
  limits: {
    // fileSize: fileSizeLimitMB,
    files: fileNumberLimit,
  },
});

function uploadImageMiddleware(req, res, next) {
  let upload;
  if (
    config.get("env") === "dev" ||
    config.get("env") === "DEV" ||
    config.get("env") === "develeopment"
  ) {
    upload = localImageUpload.array("image");
  } else {
    upload = s3ImageUpload.array("image");
  }

  upload(req, res, async (err) => {
    console.log(err);
    if (err instanceof multer.MulterError) {
      res.status(400).send("LIMIT_ERROR");
    } else {
      next();
    }
  });
}

module.exports = { localImageUpload, s3ImageUpload, uploadImageMiddleware };
