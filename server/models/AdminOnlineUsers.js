const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newSchema = new Schema(
  {
    socketid: String,
    Username: String,
    Userstatus: String,
    userImageUrl: String,
    AdminName: {
      type: String,
      required: false,
    },
    Admin: {
      type: Boolean,
      required: false,
    },
    DeviceToken: {
      type: String,
      required: false,
    },
    Uuid: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = AdminsOnlineuser = mongoose.model(
  "AdminsOnlineuser",
  newSchema
);
