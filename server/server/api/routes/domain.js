const express = require("express");
const auth = require("../../../middleware/auth");
const UserSchema = require("../../../models/User");
const mytyBot = require("../../../middleware/mytyBot");

const router = express.Router();

router.get("/findby/:subdomain", async (req, res) => {
  const { subdomain } = req.params;

  const result = await UserSchema.findOne({ subdomain });
  // mytyBot(req.originalUrl, subdomain, `finding subdomain by ${subdomain}`);
  res.send({
    message: `finding subdomain by ${subdomain}`,
    result,
  });
});

router.get("/findbyId/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const result = await UserSchema.findById(id);
  // console.log(result.subdomain);
  // mytyBot(req.originalUrl, subdomain, "finding subdomain by Id");
  res.send({
    message: `finding subdomain by ${id}`,
    subdomain: result.subdomain,
  });
});

router.put("/put", auth, async (req, res) => {
  const { id } = req.user;
  const { subdomain } = req.body;

  const result = await UserSchema.findOneAndUpdate(
    { _id: id },
    { subdomain },
    { new: true }
  );
  // mytyBot(req.originalUrl, subdomain, `domain set by ${subdomain}`);
  res.status(200).send({
    message: `domain set by ${subdomain}`,
    result,
  });
});

module.exports = router;
