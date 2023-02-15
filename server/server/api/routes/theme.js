const express = require("express");
const Theme = require("../../../models/ThemeSchema");
const auth = require("../../../middleware/auth");
const mytyBot = require("../../../middleware/mytyBot");

const router = express.Router();

router.post("/body-styles", auth, async (req, res) => {
  const { user_id, body_appearance } = req.body;
  const result = await Theme({ user_id, body_appearance }).save();
  // mytyBot(req.originalUrl, "", "Posted at /body-styles");
  res.send({
    msg: "Posted at /body-styles",
    result,
  });
});

router.get("/body-styles/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const result = await Theme.findOne({ user_id });
  // mytyBot(req.originalUrl, "", "Got from /body-styles/user_id");
  res.send({
    msg: "Got from /body-styles/user_id",
    result,
  });
});

router.put("/body-styles", auth, async (req, res) => {
  const { user_id, body_appearance } = req.body;
  console.log({ body_appearance });
  const result = await Theme.findOneAndUpdate(
    { user_id },
    { body_appearance },
    { new: true }
  );
  // mytyBot(req.originalUrl, "", "Put at /body-styles");
  res.send({
    msg: "Put at /body-styles",
    result,
  });
});

module.exports = router;
