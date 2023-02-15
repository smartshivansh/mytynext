const express = require("express");
const router = express.Router();
var User = require("../../../models/User");
const mytyBot = require("../../../middleware/mytyBot");

router.post("/", (req, res) => {
  const { title, description, sitemap, id } = req.body;
  User.findOneAndUpdate(
    { _id: id },
    { seo: { title: title, description: description } },
    function (err) {
      if (err) {
        // mytyBot(req.originalUrl, err, "error in seo");
        console.log("error in server", err);
      } else {
        // mytyBot(req.originalUrl, "", "seo successfully saved ");
        console.log("successfully saved ");
      }
    }
  );
  // mytyBot(req.originalUrl, "", "recieved seo parameters");
  res.send({
    msg: "recieved seo parameters",
    title,
    description,
    sitemap,
  });
});

router.post("/available", (req, res) => {
  // console.log("this route ran");
  const { id } = req.body;

  if (!id) {
    console.log("sending error");
    res.sendStatus(404);
    return;
  }

  User.findById({ _id: id }).then((data) => {
    res.send(data);
    // if (data) {
    //   res.status(200).send({ msg: "successfully fatched", data });
    // } else {
    //   console.log("error in server", err);
    // }
  });
});

module.exports = router;
