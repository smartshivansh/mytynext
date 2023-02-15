const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImagePostSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    caption: {
      type: Schema.Types.String,
    },
    // images: {
    //   type: Schema.Types.Array,
    // },
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: "temp_mediaImage",
      },
    ],
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
      default: "IMAGE",
    },
    likes: { type: Schema.Types.ObjectId, ref: "likes" },
    private: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = ImagePosts = mongoose.model("temp_imagePost", ImagePostSchema);
