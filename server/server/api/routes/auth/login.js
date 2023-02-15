const express = require("express");
const config = require("config");
const { OAuth2Client } = require("google-auth-library");
const CLIENTID = config.get("CLIENT_ID");
const client = new OAuth2Client(CLIENTID);
const smsotp = require("../../services/smsOtpServices");
const {
  generateOTPForMobileLogin,
  verifyOTPForMobileLogin,
  generateJWT,
} = require("./login.services");
const { getErrorByMessage, getErrorCodeByMessage } = require("./errors");

const Router = express.Router();

Router.post("/with-google", async (req, res) => {
  // console.log("yes i am from  inside login api", req.body);
  const { token } = req.body;
  const auth = await client.verifyIdToken({
    idToken: token,
    audience: CLIENTID,
  });
  const { name, email, picture } = auth.getPayload();

  res.status(201).send({ name, email, picture, auth: auth.getPayload() });
});

Router.post("/smsotp", (req, res) => {
  console.log("yes i am   inside smsotp ");
});

// Router.post("/smsotp3", async (req, res) => {
//   try {
//     const { data } = await axios.post(
//       "https://www.fast2sms.com/dev/bulkV2",
//       {
//         sender_id: "Cghpet",
//         message: "2536 is OTP ,welcome to MYTY ",
//         route: "v3",
//         numbers: "8103681868",
//       },
//       {
//         headers: {
//           authorization: SMS_ID,
//         },
//       }
//     );

//     console.log("data received reas of axios", data);
//     res.status(200).send("ok");
//   } catch (error) {
//     console.log("error in catch ", error);
//     res.send(error);
//   }
// });

Router.post("/email-password", async (req, res) => {
  console.log("email-password ");
  try {
    res.send({ messge: "email-password" });
  } catch (error) {
    res.status(400).send(error);
  }
});

Router.post("/mobile-otp/send", async (req, res) => {
  try {
    const { mobile, hash } = req.body;
    const data = await generateOTPForMobileLogin(mobile, hash);
    res.status(200).send({ data });
  } catch (error) {
    res
      .status(getErrorCodeByMessage(error.message))
      .send(getErrorByMessage(error.message));
  }
});

Router.post("/mobile-otp/verify", async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const user = await verifyOTPForMobileLogin(mobile, otp);
    const token = generateJWT({ id: user._id });
    res.status(200).send({ user, token });
  } catch (error) {
    res
      .status(getErrorCodeByMessage(error.message))
      .send(getErrorByMessage(error.message));
  }
});

module.exports = Router;
