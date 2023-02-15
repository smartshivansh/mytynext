const express = require("express");
const router = express.Router();
const Betauser = require("../../../models/Betauser");
const mytyBot = require("../../../middleware/mytyBot");

const { WelcomeMail } = require("../services/OTPMailServices");

router.post("/signup", async (req, res) => {
  const userdata = req.body;
  const newUser = new Betauser({ ...userdata });
  const result = await newUser.save();
  if (result) {
    WelcomeMail(result.email);
    mytyBot(req.originalUrl, req.body, " beta user signup ");
    res.status(200).send({
      _id: result.id,
      name: result.name,
    });
  } else {
    mytyBot(req.originalUrl, req.body, "Invalid User Data.");
    res.status(401).send({ error: "Invalid User Data." });
  }
});

module.exports = router;
