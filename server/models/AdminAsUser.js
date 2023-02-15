const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newSchema = new Schema({
  socketid: String,
  Username: String,
  Userstatus: String,
  userImageUrl: String,
  adminImageUrl: String,
  Subdomain: String,
  messageNotification: Number,
  AdminName: {
    type: String,
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
});

module.exports = AdminAsUser = mongoose.model("AdminAsUser", newSchema);
