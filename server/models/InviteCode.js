const mongoose = require("mongoose");
const { Schema } = mongoose;

const invitecodeSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("InviteCode", invitecodeSchema);
