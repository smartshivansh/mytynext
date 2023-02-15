const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newSchema = new Schema({
  socketid:String,
  Username:String,
  Userstatus:String,
  Official:Boolean,
});

module.exports = Onlineuser = mongoose.model("Onlineuser", newSchema);