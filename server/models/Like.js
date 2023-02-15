const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeSchema = new Schema({
  userId: String,
});

const likesSchema = new Schema({
  postId: String,
  // likes: [likeSchema],
  likes: Schema.Types.Array,
});

const likeModel = mongoose.model("like", likeSchema);
const likesModel = mongoose.model("likes", likesSchema);

module.exports = { likeModel, likesModel };
