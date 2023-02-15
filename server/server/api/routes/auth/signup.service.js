const inviteCode = require("../../../../models/InviteCode");
const signup = require("../../../../models/Signup");
const user = require("../../../../models/User");
const rn = require("random-number");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mytyBot = require("../../../../middleware/mytyBot");
const config = require("config");
const { authErrors } = require("./errors");
const {
  MailSignupOTP,
  PlanRequestEmailToUser,
  PlanRequestEmailToAdmins,
  planUpgradeEmailToUser,
  planUpgradeEmailToAdmins,
  requestEnterprisePlanEmailToUser,
  requestEnterprisePlanEmailToAdmins,
} = require("../../services/OTPMailServices");
const { smsOtp } = require("../../services/smsOtpServices");
const logger = require("../../services/logger");

async function validateInviteCode(code) {
  const available = await inviteCode.findOneAndUpdate(
    { code, status: "not allocated" },
    { status: "allocated" },
    { new: true }
  );
  // console.log("available", available);

  if (available) {
    return true;
  } else {
    throw new Error(authErrors.invalidCode.message);
  }
}

function generateOTP() {
  return rn({
    min: 100000,
    max: 999999,
    integer: true,
  }).toString();
}

async function createSignupEntryWithInviteCode(email, inviteCode) {
  const existing = await user.findOne({ email });

  if (existing) {
    throw new Error(authErrors.duplicateEmail.message);
  } else {
    const otp = generateOTP();
    const existingSignup = await signup.findOne({ email });

    if (existingSignup) {
      const updatedSignup = await signup.findOneAndUpdate(
        { email },
        { otp },
        { new: true }
      );

      mytyBot(`Signup verification mailing ${otp} to ${email}.`);
      MailSignupOTP(email, otp);
      return updatedSignup;
    } else {
      const createdSignup = await new signup({
        email,
        otp,
        inviteCode,
        verified: false,
      });
      const savedSignup = await createdSignup.save();
      return savedSignup;
    }
  }
}

async function createSignupEntry(email) {
  const existing = await user.findOne({ email });

  if (existing) {
    throw new Error(authErrors.duplicateEmail.message);
  } else {
    const otp = generateOTP();
    const existingSignup = await signup.findOne({ email });

    if (existingSignup) {
      const updatedSignup = await signup.findOneAndUpdate(
        { email },
        { otp },
        { new: true }
      );
      mytyBot(`Signup verification mailing ${otp} to ${email}.`);
      MailSignupOTP(email, otp);
      return updatedSignup;
    } else {
      const createdSignup = await new signup({
        email,
        otp,
        verified: false,
      });
      const savedSignup = await createdSignup.save();
      mytyBot(`Signup verification mailing ${otp} to ${email}.`);
      MailSignupOTP(email, otp);
      return savedSignup;
    }
  }
}

async function createSignupEntryForMobile(mobile, hash) {
  const existing = await user.findOne({ mobile });

  console.log("user exist or not ", existing);
  logger.info(`mobile ${mobile}, hash ${hash}`);

  if (existing) {
    logger.info(`duplicateUser ${existing._id}`);
    throw new Error(authErrors.duplicateMobile.message);
  } else {
    const otp = generateOTP();
    const existingSignup = await signup.findOne({ mobile });

    if (existingSignup) {
      const updatedSignup = await signup.findOneAndUpdate(
        { mobile },
        { otp },
        { new: true }
      );
      logger.info(`updatedSignup ${updatedSignup._id}`);

      // console.log(`Signup if verification mobile ${otp} to ${mobile}.`);
      mytyBot(`Signup verification mobile ${otp} to ${mobile}.`);

      if (
        config.get("env") === "dev" ||
        config.get("env") === "DEV" ||
        config.get("env") === "development" ||
        config.get("env") === "DEVELOPMENT"
      ) {
        console.log("SMS otp not available in Development");
        return updatedSignup;
      } else {
        const successfull = await smsOtp(otp, mobile, hash);
        logger.info(`otpResponse ${JSON.stringify(successfull)}`);
        if (successfull.error) {
          return successfull;
        }
        return updatedSignup;
      }
    } else {
      const createdSignup = await new signup({
        mobile,
        otp,
        verified: false,
      });
      const savedSignup = await createdSignup.save();
      logger.info(`savedSignup ${savedSignup._id}`);

      // console.log(`Signup else verification mobile ${otp} to ${mobile}.`);
      mytyBot(`Signup verification mobile ${otp} to ${mobile}.`);

      if (
        config.get("env") === "dev" ||
        config.get("env") === "DEV" ||
        config.get("env") === "development" ||
        config.get("env") === "DEVELOPMENT"
      ) {
        console.log("SMS otp not available in Development");
        return savedSignup;
      } else {
        const successfull = await smsOtp(otp, mobile, hash);
        logger.info(`otpResponse ${JSON.stringify(successfull)}`);
        if (successfull.error) {
          return successfull;
        }
        return savedSignup;
      }
    }
  }
}

async function verifyOTP(email, mobile, otp) {
  const updatedSignup = await signup.findOneAndUpdate(
    { $or: [{ email }, { mobile }], otp },
    { verified: true },
    { new: true }
  );

  if (updatedSignup) {
    logger.info(`updatedSignup ${updatedSignup._id}`);
    return updatedSignup;
  } else {
    console.log("throw errro");
    logger.info(`otp match!!`);
    throw new Error(authErrors.otpMismatch.message);
  }
}

async function generateUserData(email, mobile, name, username, password) {
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  return {
    email,
    mobile,
    name,
    username,
    password: passwordHash,
  };
}

function generateJWT(payload) {
  return jwt.sign(payload, config.get("jwtSecret"), { expiresIn: "7d" });
}

async function checkUserEntry(email, mobile, userData) {

  if (mobile) {
    const existingMobile = await user.findOne({ mobile: mobile });

    if (existingMobile) {
      throw new Error(authErrors.duplicateMobile.message);
    } else {
      const existingUsername = await user.findOne({ username: userData.username });
      if (existingUsername) {
        throw new Error(authErrors.duplicateUsername.message);
      } else {
        return userData;
      }

    }
  }

  if (email) {
    const existingEmail = await user.findOne({ email: email });

    if (existingEmail) {
      throw new Error(authErrors.duplicateEmail.message);
    } else {
      const existingUsername = await user.findOne({ username: userData.username });
      if (existingUsername) {
        throw new Error(authErrors.duplicateUsername.message);
      } else {
        return userData;
      }

    }
  }

}

async function createUserEntry(email, mobile, userData) {
  const existing = await user.findOne({ username: userData.username });

  console.log(
    `\nUser(email: ${email} - mobile: ${mobile}) trying to signup with name: ${userData.name}, username ${userData.username}`
  );
  mytyBot(
    `User(email: ${email} - mobile: ${mobile}) trying to signup with name: ${userData.name}, username ${userData.username}`
  );

  if (existing) {
    throw new Error(authErrors.duplicateUsername.message);
  } else {
    const verifiedSignup = await signup.findOne({
      $or: [{ email }, { mobile }],
      verified: true,
    });
    logger.info(`verifiedSignup ${verifiedSignup._id}`);

    if (verifiedSignup) {
      const createdUser = await new user(userData);
      // return createdUser;
      const savedUser = await createdUser.save();
      logger.info(`savedUser ${savedUser._id}`);
      return savedUser;
    } else {
      throw new Error(authErrors.unverifiedEmail.message);
    }
  }
}

async function updateUserWithProfileInfo(user_id, profileData) {
  try {
    const updatedUser = await user.findByIdAndUpdate(user_id, profileData, {
      new: true,
    });
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

async function updateUserPlan(user_id, planData) {
  try {
    const updatedUser = await user.findByIdAndUpdate(user_id, planData, {
      new: true,
    });
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

async function requestUserPlanUpgrade(user_id, plan) {
  try {
    const foundUser = await user.findById(user_id);
    //    console.log(foundUser?.plan);
    if (!foundUser.plan) {
      // if plan is undefined - which is chosing plan for signup with
      // set free and send mails
      console.log("plan should be undefined and setting it free");
      const updatedUser = await user.findByIdAndUpdate(
        user_id,
        {
          plan: "free",
          upgradeRequest: true,
        },
        { new: true }
      );
      mytyBot(`User upgrade request mailed to care@myty.in.`);
      mytyBot(
        `User upgrade request confirmation mailed to ${updatedUser.email}.`
      );
      await PlanRequestEmailToAdmins(updatedUser, plan);
      await PlanRequestEmailToUser(updatedUser.email, plan);
    } else {
      // if plan is something - which is chosing plan for upgrade
      // keep free but also send mails
      const updatedUser = await user.findByIdAndUpdate(
        user_id,
        {
          upgradeRequest: true,
        },
        { new: true }
      );
      mytyBot(`User upgrade request mailed to care@myty.in.`);
      mytyBot(
        `User upgrade request confirmation mailed to ${updatedUser.email}.`
      );
      PlanRequestEmailToAdmins(updatedUser, plan);
      PlanRequestEmailToUser(updatedUser.email, plan);
    }
  } catch (error) {
    console.log(error);
  }
}

async function updateUserInterests(user_id, interests) {
  try {
    const updatedUser = await user.findByIdAndUpdate(
      user_id,
      { interests },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

async function updateUserPlanAfterPayment(user_id, plan, paymentInfo) {
  // console.log({ user_id, plan, paymentInfo });

  try {
    const updatedUser = await user.findByIdAndUpdate(
      user_id,
      { plan, paymentInfo },
      { new: true }
    );

    console.log(
      `\n${updatedUser.name}(email: ${updatedUser.email} - mobile: ${updatedUser.mobile}) has taken plan: ${plan}.`
    );
    mytyBot(
      `${updatedUser.name}(email: ${updatedUser.email} - mobile: ${updatedUser.mobile}) has taken plan: ${plan}.`
    );

    planUpgradeEmailToUser(updatedUser);
    planUpgradeEmailToAdmins(updatedUser);

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

async function acceptUserRequestForEnterprise(user_id, email, name, phone) {
  console.log({ user_id });

  try {
    const foundUser = await user.findById(user_id).select("name email _id");
    if (foundUser) {
      requestEnterprisePlanEmailToUser(foundUser);
      requestEnterprisePlanEmailToAdmins({
        user: foundUser,
        name,
        email,
        phone,
      });
      return foundUser;
    } else {
      requestEnterprisePlanEmailToUser({ email, name, phone });
      requestEnterprisePlanEmailToAdmins({ email, name, phone });
      return { email, name, phone };
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  validateInviteCode,
  createSignupEntryWithInviteCode,
  createSignupEntry,
  createSignupEntryForMobile,
  verifyOTP,
  generateUserData,
  checkUserEntry,
  createUserEntry,
  generateJWT,
  updateUserWithProfileInfo,
  updateUserPlan,
  requestUserPlanUpgrade,
  updateUserInterests,
  updateUserPlanAfterPayment,
  acceptUserRequestForEnterprise,
};
