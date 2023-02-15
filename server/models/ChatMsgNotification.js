const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newSchema = new Schema({
  subDomain: String,
  adminName: String,
  userMsgNotification: [
    {
      userName: String,
      numberOfMsg: Schema.Types.Number,
    },
  ],
});

module.exports = ChatMsgNotification = mongoose.model(
  "ChatMsgNotification",
  newSchema
);
