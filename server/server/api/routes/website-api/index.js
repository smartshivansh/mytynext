const express = require("express");
const Router = express.Router();
const { lookupFromCache, saveToCache } = require("./cacheService");

const User = require("../../../../models/User");
const Profile = require("../../../../models/ProfileCardSchema");
const Navbar = require("../../../../models/NavigationBarSchema");
const Theme = require("../../../../models/ThemeSchema");

Router.get("/:subdomain", async (req, res) => {
  const subdomain = req.params.subdomain;

  let data = null;
  data = await lookupFromCache(subdomain);

  if (data) {
    res.send({ ...data });
  } else {
    data = {};

    try {
      const foundUser = await User.findOne({ subdomain: subdomain }).select(
        "-password -qrcode"
      );

      // console.log(foundUser._id);
      // const foundProfile = await Profile.findOne({ user_id: foundUser._id });
      // const foundNavbar = await Navbar.findOne({ user_id: foundUser._id });
      // const foundTheme = await Theme.findOne({ user_id: foundUser._id });

      // data.user = foundUser;
      // data.profile = foundProfile;
      // data.navbar = foundNavbar;
      // data.theme = foundTheme;
      // const foundUser = User.findOne({ subdomain: subdomain }).select(
      //   "-password -qrcode"
      // );
      // console.log(foundUser._id);

      const foundProfile = Profile.findOne({ user_id: foundUser._id });
      const foundNavbar = Navbar.findOne({ user_id: foundUser._id });
      const foundTheme = Theme.findOne({ user_id: foundUser._id });

      const [profile, navbar, theme] = await Promise.all([
        foundProfile,
        foundNavbar,
        foundTheme,
      ]);

      data.user = foundUser;
      data.profile = profile;
      data.navbar = navbar;
      data.theme = theme;

      saveToCache(subdomain, data);

      res.send({
        queryBySubdomain: req.params.subdomain,
        userId: foundUser._id,
        ...data,
      });
    } catch (error) {
      console.log(error);
      // res.sendStatus(400);
      res.status(400).send(error);
    }
  }
});

module.exports = Router;
