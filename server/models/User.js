const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      // required: true,
      // unique: true,
    },
    mobile: {
      type: Number,
      // required: true,
      // unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      required: false,
    },
    age: {
      type: Number,
    },
    image_url: {
      type: String,
    },
    image_url_compress: {
      type: String,
    },
    userlink: {
      type: String,
    },
    plan: {
      type: String,
      default: "free",
    },
    paymentInfo: {
      type: Object,
    },
    upgradeRequest: {
      type: Boolean,
      default: false,
    },
    interests: {
      type: Array,
      default: [],
    },
    domain: {
      type: String,
      default: "",
    },
    subdomain: {
      type: String,
      default: "",
    },
    subdomainInfo: {
      type: Schema.Types.Mixed,
    },
    tutor: {
      type: Boolean,
      default: false,
    },
    location: {
      type: Object,
      default: {
        lat: 0,
        lng: 0,
      },
    },
    seo: {
      type: Object,
    },
    place: {
      type: Object,
      default: {
        name: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        pluscode: "",
        phone: "",
      },
    },
    qrcode: {
      type: String,
      default: "",
    },
    register_date: {
      type: Date,
      default: Date.now,
    },
    setupLink: {
      type: Object,
      default: {
        progress: 1,
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
