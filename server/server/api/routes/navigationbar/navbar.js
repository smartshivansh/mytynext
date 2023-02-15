const express = require("express");
const auth = require("../../../../middleware/auth");
const NavigationBar = require("../../../../models/NavigationBarSchema");
const User = require("../../../../models/User");

const router = express.Router();

router.post("/post/newnav", auth, async (request, response) => {
  const { user_id, itemData } = request.body;
  // console.log(user_id, itemData);
  const menu_items = [itemData];

  const resultNav = await NavigationBar({ user_id, menu_items }).save();
  // console.log(resultNav);

  response.send({
    messege: "NavBar posted new",
    result: resultNav,
  });
});

router.put("/put/item/:nav_id", auth, async (request, response) => {
  const { nav_id } = request.params;
  const { itemData } = request.body;
  // console.log(nav_id, itemData);
  const resultNav = await NavigationBar.findByIdAndUpdate(
    nav_id,
    { $push: { menu_items: itemData } },
    { new: true }
  );

  response.send({
    messege: "NavBar item put single",
    result: resultNav,
  });
});

router.put("/put/items/:nav_id", auth, async (request, response) => {
  const { nav_id } = request.params;
  const { itemData } = request.body;

  const resultNav = await NavigationBar.findByIdAndUpdate(
    nav_id,
    { menu_items: itemData },
    { new: true }
  );

  response.send({
    messege: "NavBar put updated data",
    result: resultNav,
  });
});

router.post("/delete/item/:nav_id", auth, async (request, response) => {
  const { nav_id } = request.params;
  const { itemData } = request.body;

  const resultNav = await NavigationBar.findByIdAndUpdate(
    nav_id,
    { $pull: { menu_items: { id: itemData.id } } },
    { new: true }
  );

  response.send({
    messege: "NavBar delete updated data",
    result: resultNav,
  });
});
// router.put("/put/theme/:nav_id", async (request, response) => {
//   const { nav_id } = request.params;
//   const { themeData } = request.body;

//   const resultNav = await NavigationBar.findByIdAndUpdate(
//     nav_id,
//     { ...themeData },
//     { new: true }
//   );

//   response.send({
//     messege: "NavBar Appearence saved",
//     result: resultNav,
//   });
// });

router.get("/get/nav/:user_id", async (req, res) => {
  const { user_id } = req.params;

  if (user_id) {
    const resultNavbar = await NavigationBar.findOne({ user_id });

    res.send({
      msg: "NavBar get",
      result: resultNavbar,
    });
  } else {
    res.send(null);
  }
});

router.post("/header-navigation", auth, async (req, res) => {
  const { user_id, brand, styles } = req.body;
  const result = await NavigationBar({
    user_id,
    brand,
    styles,
  }).save();
  res.send({
    msg: "Posted at /header-navigation",
    result,
  });
});

router.get("/header-navigation/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const result = await NavigationBar.findOne({ user_id });
  res.send({
    msg: "Got from /header-navigation/user_id",
    result,
  });
});

router.put("/header-navigation/brand", auth, async (req, res) => {
  const { user_id, brand } = req.body;

  const result = await NavigationBar.findOneAndUpdate(
    { user_id },
    { brand },
    { new: true }
  );
  res.send({
    msg: "Put at /header-navigation/brand",
    result,
  });
});

router.put("/header-navigation/styles", auth, async (req, res) => {
  const { user_id, styles } = req.body;

  const result = await NavigationBar.findOneAndUpdate(
    { user_id },
    { styles },
    { new: true }
  );
  res.send({
    msg: "Put at /header-navigation/styles",
    result,
  });
});

module.exports = router;
