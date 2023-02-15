const express = require("express");
const auth = require("../../../../middleware/auth");
const ProfileCard = require("../../../../models/ProfileCardSchema");
const User = require("../../../../models/User");
const mytyBot = require("../../../../middleware/mytyBot");

const router = express.Router();

// router.get("/", async (req, res) => {
//   res.status(200).send({
//     msg: "at /profilecard",
//   });
// });

router.get("/:user_id", async (req, res) => {
  const user_id = req.params.user_id;

  await ProfileCard.findOne({
    user_id: user_id,
  })
    .then(async (value) => {
      if (value) {
        // mytyBot(req.originalUrl, "", "profile found.");
        res.send({
          msg: "profile found.",
          result: value,
        });
      } else {
        // res.send({
        //   msg: "user not found.",
        //   result: value,
        // });

        const user = await User.findById(user_id).select("name image_url");
        // console.log(userName);

        const profileCard = new ProfileCard({
          user_id: user_id,
          name: user.name,
          image_url: user.image_url,
        });
        profileCard.save().then((value) => {
          // mytyBot(req.originalUrl, "", "new profile card created for the user");
          res.send({
            msg: "new profile card created for the user",
            result: value,
          });
        });
      }
    })
    .catch((err) => {
      if (err) {
        // mytyBot(req.originalUrl, err, "some error occured.");
        res.send({
          msg: "some error occured.",
        });
      }
    });
});

router.post("/save", auth, async (req, res) => {
  // console.log("/save req.body", req.body);
  const result = await ProfileCard.findOneAndUpdate(
    {
      user_id: req.body.profilecard.user_id,
    },
    req.body.profilecard,
    { new: true, upsert: true }
  );

  await User.findOneAndUpdate(
    { _id: req.body.profilecard.user_id },
    {
      image_url: req.body.profilecard.image_url,
      image_url_compress: req.body.profilecard.image_url_compress,
      name: req.body.profilecard.name,
    }
  );
  // mytyBot(req.originalUrl, "", "updates saved.");
  res.status(200).send({
    msg: "updates saved.",
    result,
  });

  // .then((value) => {
  //   res.send({
  //   });
  // })
  // .catch((err) => {
  //   if (err) {
  //     res.send({
  //       msg: "some error occured during saving data!",
  //     });
  //   }
  // });
});

module.exports = router;
