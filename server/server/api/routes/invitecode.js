const express = require("express");
const router = express.Router();
const InviteCode = require("../../../models/InviteCode");

const mytyBot = require("../../../middleware/mytyBot");

router.post("/available", async (req, res) => {
  // const genCode = await code.findById({ _id: "60dd3ba2624ab1731ddc9dec" });
  // console.log("genCode", genCode);
  // console.log("req.body", req.body);
  const { code } = req.body;

  // const genCode = await code.findById({ _id: '60dd3ba2624ab1731ddc9dec' });
  // console.log('invite code at invite', req.body.code);
  // const validator = genCode.code.find((data) => data.code === req.body.code);
  // console.log('result of validator', validator);

  const result = await InviteCode.findOne({ code });
  console.log(result);
  if (result) {
    if (result.status === "not allocated") {
      // mytyBot(req.originalUrl, "", "Not allocated");
      res.status(200).send({ msg: "Not allocated" });
    } else {
      // mytyBot(req.originalUrl, "", "WRONG_CODE");
      res.status(401).send({
        msg: "WRONG_CODE",
      });
      // res.sendStatus(401);
      // .status(200)
      // .send({ error: "Code Is Not Valid Please Check The Code...?" });
    }
  } else {
    console.log("err");
    res.status(401).send({
      msg: "WRONG_CODE",
    });
  }
});

module.exports = router;
