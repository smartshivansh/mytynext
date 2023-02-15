const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
      default: "",
    },
    user_fullname: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
    tags: {
      type: Array,
      default: [],
    },
    slug: {
      type: String,
      default: "",
    },
    featured_image: {
      type: String,
      default: "",
    },
    content_raw: {
      type: String,
    },
    last_update_date: {
      type: Date,
    },
    last_update_date_string: {
      type: String,
    },
    drafted: {
      type: Boolean,
      default: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    feeds: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Schema.Types.String,
      default: "BLOG",
    },
    updatedAt: {
      type: Date,
    },
    likes: { type: Schema.Types.ObjectId, ref: "likes" },
    private: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ! this model name need to changed to blog not tempblog
module.exports = Blog = mongoose.model("temp_blog", BlogSchema);
