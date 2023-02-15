const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeletedMediaSchema = new Schema(
  {
    deleted: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = DeletedMedia = mongoose.model(
  "temp_deletedMedia",
  DeletedMediaSchema
);
