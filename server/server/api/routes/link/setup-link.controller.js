const express = require("express");
const user = require("../../../../models/User");
const auth = require("../../../../middleware/auth");
const BookLink = require("../../../../models/BookLink")
const Router = express.Router();

Router.post("/subdomaincheck", async (req, res)=>{
  const subdomain = req.body.subdomain;
  console.log(subdomain);
  try {
    const checkbooklink = await BookLink.findOne({subdomain})
    if(checkbooklink){
        res.json(JSON.stringify({ sucess:false, message:"Not Available"})) 
    }
    else{
        res.json(JSON.stringify({ sucess:true, message:"Available"})) 
    }
} catch (error) {
    console.log("Error in CheckBooklink", error)
}
})

Router.patch("/subdomain", auth, async (req, res) => {
  const userId = req.user.id;

  try {
    const updatedUser = await user.findByIdAndUpdate(
      userId,
      {
        setupLink: linkSetup_configuredLink,
      },
      { new: true }
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(error.message);
  }
});

Router.patch("/appearance", auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const updatedUser = await user.findByIdAndUpdate(
      userId,
      {
        setupLink: linkSetup_configuredAppearance,
      },
      { new: true }
    );

    res.sendStatus(200);
  } catch (error) {}
});

Router.patch("/profile", auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const updatedUser = await user.findByIdAndUpdate(
      userId,
      {
        setupLink: linkSetup_configuredProfile,
      },
      { new: true }
    );

    res.sendStatus(200);
  } catch (error) {}
});

Router.patch("/qrcode", auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const updatedUser = await user.findByIdAndUpdate(
      userId,
      {
        setupLink: linkSetup_configuredQRCode,
      },
      { new: true }
    );

    res.sendStatus(200);
  } catch (error) {}
});

module.exports = Router;

const linkSetup_start = {
  progress: 1,
  link: null,
  appearance: null,
  profile: null,
  qrcode: null,
};
const linkSetup_configuredLink = {
  progress: 2,
  link: true,
  appearance: null,
  profile: null,
  qrcode: null,
};
const linkSetup_configuredAppearance = {
  progress: 3,
  link: true,
  appearance: true,
  profile: null,
  qrcode: null,
};
const linkSetup_configuredProfile = {
  progress: 4,
  link: true,
  appearance: true,
  profile: true,
  qrcode: null,
};
const linkSetup_configuredQRCode = {
  progress: 5,
  link: true,
  appearance: true,
  profile: true,
  qrcode: true,
};
