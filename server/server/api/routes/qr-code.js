const express = require("express");
const axios = require("axios");
const Router = express.Router();

Router.post("/", async (req, res) => {
  // console.log(req.body);
  const qr = await axios.post(
    "https://api.qrcode-monkey.com/qr/custom",
    req.body
  );
  res.send(qr.data);
});

Router.post("/upload-image", async (req, res) => {
  const qr = await axios.post(
    "https://api.qrcode-monkey.com//qr/uploadimage",
    req.body
  );
  res.send(qr.data);
});

module.exports = Router;
