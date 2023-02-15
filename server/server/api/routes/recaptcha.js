const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  const captcha = req.body.captcha;
  const secretKey = require("config").get("recaptcha_secret");

  if (captcha === undefined || captcha === null || captcha === "") {
    // console.log({ captcha });
    res.send({ msg: "FAILED" });
  } else {
    const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}`;
    // console.log({ verifyURL });

    const response = await axios.get(verifyURL);
    const body = await response.data;
    // console.log(response);

    if (body.success !== undefined && !body.success) {
      res.send({ msg: "FAILED" });
    } else {
      res.send({ msg: "PASSED" });
    }
  }
});

module.exports = router;
