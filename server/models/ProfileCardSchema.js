const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileCardSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
    },
    name: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: null,
    },
    image_url: {
      type: String,
      default: "",
    },
    active_status: Boolean,
    last_online: Date,
    tags: Array,
    links: {
      type: Object,
      default: {},
    },
  },
  { minimize: false, timestamp: true }
);

module.exports = ProfileCard = mongoose.model(
  "temp_profilecard",
  ProfileCardSchema
);
