const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MediaVideoSchema = new Schema(
  {
    src: {
      type: Schema.Types.String,
    },
    thumb: {
      type: Schema.Types.String,
    },
    type: {
      type: Schema.Types.String,
      default: "VIDEO",
    },
    likes: { type: Schema.Types.ObjectId, ref: "likes" },
  },
  {
    timestamps: true,
  }
);

module.exports = mediaVideo = mongoose.model(
  "temp_mediaVideo",
  MediaVideoSchema
);
