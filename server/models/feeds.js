const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedsSchema = new Schema(
  { feeds: Schema.Types.Array },
  { timestamps: true }
);

module.exports = Feed = mongoose.model("Feed", feedsSchema);
