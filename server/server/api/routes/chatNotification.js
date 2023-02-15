const express = require("express");
const { ObjectId } = require("mongodb");
const chatNotificationModel = require("../../../models/ChatMsgNotification");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const created = await chatNotificationModel({
      adminName: "admin002",
      userMsgNotification: [
        {
          userName: "userX",
          numberOfMsg: 0,
        },
        {
          userName: "userY",
          numberOfMsg: 0,
        },
      ],
    });
    const saved = await created.save();
    res.jsonp(saved);
  } catch (error) {
    res.jsonp(error.message);
  }
});

router.get("/find", async (req, res) => {
  const { admin, user } = req.body;
  try {
    const found = await chatNotificationModel.findOne({
      adminName: admin,
      "userMsgNotification.userName": user,
    });

    if (found) res.jsonp(found);

    if (!found) {
      const updated = await chatNotificationModel.findOneAndUpdate(
        { adminName: admin },
        {
          $push: { userMsgNotification: { userName: user, numberOfMsg: 0 } },
        },
        { new: true }
      );
      res.jsonp(updated);
    }
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/add", async (req, res) => {
  try {
    res.jsonp();
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const found = await chatNotificationModel.findById(req.params.id);
    res.jsonp(found);
  } catch (error) {
    res.jsonp(error.message);
  }
});

router.get("/findby-userId/:id", async (req, res) => {
  try {
    const filter = {
      "userMsgNotification._id": new ObjectId(req.params.id),
    };
    const update = {
      $inc: { "userMsgNotification.$.numberOfMsg": 1 },

      // $set: {
      //   "userMsgNotification.$.numberOfMsg": {
      //     $inc: { "userMsgNotification.$.numberOfMsg": 1 },
      //   },
      // },
    };

    const found = await chatNotificationModel.findOneAndUpdate(filter, update, {
      new: true,
    });

    if (found) {
    }

    res.jsonp(found);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
