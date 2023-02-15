const express = require("express");
const router = express.Router();
const config = require("config");
var User = require("../../../models/User");
const mytyBot = require("../../../middleware/mytyBot");

const GoogleApi = config.get("GOOGLE_API_KEY");
router.get("/", (req, res) => {
  // mytyBot(req.originalUrl, "", "recieved api");
  res.send({
    msg: "recieved api",
    apiKey: GoogleApi || "",
  });
});

router.post("/info", async (req, res) => {
  const { id } = req.body;
  const data = await User.findById({ _id: id });

  res.send({ msg: "recievsuccessfully saved  location ", data });
});

router.post("/", (req, res) => {
  const { location, id } = req.body;
  // console.log("location and id in server", location, id);
  User.findOneAndUpdate(
    { _id: id },
    { location: { lat: location.lat, lng: location.lng } },
    function (err, data) {
      if (err) {
        // mytyBot(req.originalUrl, err, "error in server");
        console.log("error in server", err);
      } else {
        // mytyBot(req.originalUrl, "", "successfully saved location");
        console.log("successfully saved ");
      }
      // mytyBot(req.originalUrl, "", "recievsuccessfully saved  location");
      res.send({
        msg: "recievsuccessfully saved  location",
        location,
      });
    }
  );
});

router.post("/place", (req, res) => {
  // console.log("place route work ");
  const { place, id } = req.body;
  // console.log("placein server", place, id);
  User.findOneAndUpdate({ _id: id }, { place }, function (err, data) {
    if (err) {
      // mytyBot(req.originalUrl, err, " error place");
      res.send({
        msg: "error place",
      });
    } else {
    }
    // mytyBot(req.originalUrl, "", "successfully saved  place");
    res.status(200).send({
      msg: "successfully saved  place",
      place,
    });
  });
});

module.exports = router;
