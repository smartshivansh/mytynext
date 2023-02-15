const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SignupSchema = new Schema(
  {
    email: {
      type: String,
      // required: true,
      // unique: true,
    },
    mobile: {
      type: Number,
      // unique: true,
      // default: null,
    },
    inviteCode: {
      type: String,
    },
    otp: {
      type: String,
    },
    verified: {
      type: Boolean,
    },
    orderInfo: {
      type: Schema.Types.Mixed,
    },
    paymentInfo: {
      type: Schema.Types.Mixed,
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const Signup = mongoose.model("Signup", SignupSchema);
module.exports = Signup;
