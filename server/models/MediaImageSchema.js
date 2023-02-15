const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MediaImageSchema = new Schema(
  {
    src: {
      type: Schema.Types.String,
    },
    thumb: {
      type: Schema.Types.String,
    },
    type: {
      type: Schema.Types.String,
      default: "IMAGE",
    },
    likes: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mediaImage = mongoose.model(
  "temp_mediaImage",
  MediaImageSchema
);
