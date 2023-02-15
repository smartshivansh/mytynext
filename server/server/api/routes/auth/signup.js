const express = require("express");
const { getErrorCodeByMessage, getErrorByMessage } = require("./errors");
const {
  validateInviteCode,
  createSignupEntry,
  createSignupEntryForMobile,
  verifyOTP,
  generateUserData,
  checkUserEntry,
  createUserEntry,
  generateJWT,
  updateUserWithProfileInfo,
  updateUserPlan,
  updateUserInterests,
  requestUserPlanUpgrade,
  updateUserPlanAfterPayment,
  acceptUserRequestForEnterprise,
} = require("./signup.service");
const mytyBOT = require("../../../../middleware/mytyBot");
const { getCookieDomain } = require("../../services/cookieService");
const mytyBot = require("../../../../middleware/mytyBot");

const Router = express.Router();

Router.post("/request-otp", async (req, res) => {
  const { email, mobile } = req.body;
  const hash = req.body?.hash ?? "";

  try {
    if (mobile) {
      const signup = await createSignupEntryForMobile(mobile, hash);
      console.log("final response in otp signup", signup);
      if (signup.error) {
        res.status(500).send(signup.error);
      } else {
        res.sendStatus(201);
      }
    } else {
      const signup = await createSignupEntry(email);
      if (signup) {
        res.sendStatus(201);
      }
    }
  } catch (error) {
    console.log("catch block ran ", error.message);
    res
      .status(getErrorCodeByMessage(error.message))
      .send(getErrorByMessage(error.message));
  }
});

Router.patch("/confirm-otp", async (req, res) => {
  const { email, mobile, otp } = req.body;
  try {
    const signup = await verifyOTP(email, mobile, otp);

    res.status(200).send(signup);
  } catch (error) {
    res
      .status(getErrorCodeByMessage(error.message))
      .send(getErrorByMessage(error.message));
  }
});

Router.post("/check-user", async (req, res) => {
  const { email, mobile, name, username, password } = req.body;

  const userData = { email, mobile, name, username, password };

  try {
    const user = await checkUserEntry(email, mobile, userData);

    res.status(201).send({ user });
  } catch (error) {
    console.log(error.message);
    res
      .status(getErrorCodeByMessage(error.message))
      .send(getErrorByMessage(error.message));
  }
});

Router.post("/submit-user", async (req, res) => {
  const { email, mobile, name, username, password } = req.body;

  const userData = await generateUserData(
    email,
    mobile,
    name,
    username,
    password
  );

  try {
    const user = await createUserEntry(email, mobile, userData);
    // console.log(user);

    const token = generateJWT({ id: user._id });

    mytyBOT(
      `New USER😀 ${name} Registered🏅 with email ${email} or mobile ${mobile}.`
    );
    // !! here domain needs to configure
    res.cookie(`token`, token, {
      domain: getCookieDomain(),
      path: "/",
    });
    res.status(201).send({ user, token });
  } catch (error) {
    console.log(error.message);
    res
      .status(getErrorCodeByMessage(error.message))
      .send(getErrorByMessage(error.message));
  }
});

Router.post("/submit-profile", async (req, res) => {
  const { user_id, age, avatar } = req.body;
  // console.log({ user_id, age, avatar });
  try {
    const user = await updateUserWithProfileInfo(user_id, {
      age,
      image_url: avatar,
    });
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send("");
  }
});

Router.patch("/submit-plan", async (req, res) => {
  const { user_id, userData } = req.body;
  console.log({ user_id, userData });

  try {
    const user = await updateUserPlan(user_id, userData);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("");
  }
});

Router.patch("/redeem-demo-plan", async (req, res) => {
  const { user_id, code, userData } = req.body;
  const { plan } = userData;

  try {
    const valid = await validateInviteCode(code);
    // console.log("valid", valid);
    if (valid) {
      const user = await updateUserPlan(user_id, userData);

      console.log(
        `\n${user.name}(email: ${user.email} - mobile: ${user.mobile}) started Demo Link with code ${code}`
      );
      mytyBot(
        `${user.name}(email: ${user.email} - mobile: ${user.mobile}) started Demo Link with code ${code}`
      );

      res.status(200).send(user);
    } else {
      res.status(400);
    }
  } catch (error) {
    console.log("error", error);
    res
      .status(getErrorCodeByMessage(error.message))
      .send(getErrorByMessage(error.message));
  }
});

Router.patch("/request-plan", async (req, res) => {
  const { user_id, userData } = req.body;
  const { plan } = userData;
  console.log("info in /request-plan", { user_id, plan });

  try {
    await requestUserPlanUpgrade(user_id, plan);
    res.sendStatus(200);
  } catch (error) { }
});

Router.patch("/submit-interests", async (req, res) => {
  const { user_id, interests } = req.body;
  console.log({ user_id, interests });
  try {
    const user = await updateUserInterests(user_id, interests);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("");
  }
});

Router.patch("/submit-plan-after-payment", async (req, res) => {
  const { user_id, plan, paymentInfo } = req.body;
  try {
    const user = await updateUserPlanAfterPayment(user_id, plan, paymentInfo);
    res.status(200).send(user);
  } catch (error) {
    res.status(400);
  }
});

Router.post("/request-enterprise-plan", async (req, res) => {
  const { user_id, email, name, phone } = req.body;
  try {
    const user = await acceptUserRequestForEnterprise(
      user_id,
      email,
      name,
      phone
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(400);
  }
});

module.exports = Router;