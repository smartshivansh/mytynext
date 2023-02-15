const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newSchema = new Schema(
  {
    message: String,
    messageMetadata: Schema.Types.Mixed,
    messageid: String,
    messagestatus: String,
    sendername: String,
    receivername: String,
    User: Object,
  },
  { timestamps: true }
);

module.exports = ChatMsg = mongoose.model("ChatMsg", newSchema);
