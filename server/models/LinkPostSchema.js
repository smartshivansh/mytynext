const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LinkPostSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    link: {
      type: Schema.Types.String,
    },
    metadata: Schema.Types.Mixed,
    published: {
      type: Boolean,
      default: true,
    },
    feeds: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Schema.Types.String,
      default: "LINK",
    },
    likes: { type: Schema.Types.ObjectId, ref: "likes" },
    private: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, minimize: false }
);

module.exports = LinkPosts = mongoose.model("temp_linkPost", LinkPostSchema);
