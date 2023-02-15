module.exports = function (file, cb) {
  const filetypes = /jpg|png|jpeg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Post Image Only!");
  }
};
