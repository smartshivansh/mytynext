const signup = require("../../../../models/Signup");
const user = require("../../../../models/User");
const { smsOtp } = require("../../services/smsOtpServices");
const rn = require("random-number");
const jwt = require("jsonwebtoken");
const config = require("config");
const { authErrors } = require("./errors");
const logger = require("../../services/logger");

function generateOTP() {
  return rn({
    min: 100000,
    max: 999999,
    integer: true,
  }).toString();
}

async function generateOTPForMobileLogin(mobile, hash) {
  try {
    console.log(mobile, hash);
    const otp = generateOTP();
    logger.info(`mobile ${mobile}, hash ${hash}`);

    const foundUser = await user.findOne({ mobile });
    logger.info(`foundUser ${foundUser?._id}`);

    if (foundUser) {
      const foundSignup = await signup.findOneAndUpdate(
        { mobile },
        { otp },
        { new: true }
      );

      if (!foundSignup) {
        console.log("no signup");
        throw new Error(authErrors.noUserFound.message);
      }

      logger.info(`foundSignup ${foundSignup._id}`);

      if (
        config.get("env") === "dev" ||
        config.get("env") === "DEV" ||
        config.get("env") === "development" ||
        config.get("env") === "DEVELOPMENT"
      ) {
        console.log("SMS otp not available in Development");
        return null;
      } else {
        const otpRes = await smsOtp(otp, mobile, hash);
        logger.info(`otpResponse ${JSON.stringify(otpRes)}`);

        if (otpRes.error) {
          logger.error(`Error: ${authErrors.otpSMSFailed.message}`);
          throw new Error(authErrors.otpSMSFailed.message);
        }
      }
    } else {
      logger.error(`Error: ${authErrors.noUserFound.message}`);
      throw new Error(authErrors.noUserFound.message);
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

async function verifyOTPForMobileLogin(mobile, otp) {
  try {
    console.log(mobile, otp);
    logger.info(`mobile ${mobile}, otp ${otp}`);
    const foundSignup = await signup.findOne({ mobile });
    logger.info(`foundSignup ${foundSignup._id}`);

    const otpMatch = foundSignup.otp === otp;
    logger.info(`otp match!!`);

    if (otpMatch) {
      const foundUser = await user.findOne({ mobile });
      logger.info(`foundUser ${foundUser?._id}`);

      if (foundUser) {
        return foundUser;
      } else {
        logger.error(`Error: ${authErrors.noUserFound.message}`);
        throw new Error(authErrors.noUserFound.message);
      }
    } else {
      logger.error(`Error: ${authErrors.otpMismatch.message}`);
      throw new Error(authErrors.otpMismatch.message);
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

function generateJWT(payload) {
  return jwt.sign(payload, config.get("jwtSecret"), { expiresIn: "7d" });
}

module.exports = {
  generateOTPForMobileLogin,
  generateJWT,
  verifyOTPForMobileLogin,
};
