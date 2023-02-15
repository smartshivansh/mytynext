const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoPostSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    caption: {
      type: Schema.Types.String,
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "temp_mediaVideo",
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
      default: "VIDEO",
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

module.exports = VideoPosts = mongoose.model("temp_videoPost", VideoPostSchema);
