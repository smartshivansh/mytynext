const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userAnalyticsSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    visitor_status: {
      type: String,
      required: true,
    },
    hostname: {
      type: String,
      required: true,
      index: true,
    },
    full_url: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    _rev: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = UserAnalytics = mongoose.model(
  "userAnalytics",
  userAnalyticsSchema
);
