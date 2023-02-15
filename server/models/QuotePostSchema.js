const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuotePostSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    quote: {
      type: Schema.Types.String,
    },
    quote_content: {
      type: Schema.Types.String,
    },
    quoted_by: {
      type: Schema.Types.String,
    },
    size: {
      type: Schema.Types.Number,
    },
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
      default: "QUOTE",
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    private: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = QuotePosts = mongoose.model("temp_quotePost", QuotePostSchema);
