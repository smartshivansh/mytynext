const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PagesSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
    },
    title: {
      type: Schema.Types.String,
    },
    path: {
      type: Schema.Types.String,
    },
    slug: {
      type: Schema.Types.String,
    },
    content: {
      type: Schema.Types.String,
    },
    description: {
      type: Schema.Types.String,
    },
  },
  { minimize: false }
);

module.exports = Pages = mongoose.model("temp_pages", PagesSchema);
