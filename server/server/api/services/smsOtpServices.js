const axios = require("axios");
const config = require("config");
const SMS_ID = config.get("SMS_OTP");

const smsOtp = async (otp, number, hash = "") => {
  try {
    const { data } = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        sender_id: "Cghpet",
        message: `${otp} is OTP, welcome to MYTY. ${hash}`,
        route: "v3",
        numbers: number,
      },
      {
        headers: {
          authorization: SMS_ID,
        },
      }
    );

    console.log("SMS axios-response", data);
    if (!data.return) throw new Error("SMS_FAILED");
    return data;
    // res.status(200).send("ok");
  } catch (error) {
    console.log("ERROR", error.message);
    console.log("RESPONSE ERROR MESSAGE", error.response.data.message);
    const errors = error?.response?.data?.message ?? error.message;
    // error.response && error.response.data.message
    //   ? error.response.data.message
    //   : error.message;
    console.log("Error occured while sending SMS", errors);
    return { error: errors };
    // throw new Error(errors);
  }
};

async function smsRequst(phoneNumber, message) {
  if (!phoneNumber) {
    throw new Error("Phone number is not provided.");
  }

  try {
    const { data } = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        sender_id: "Cghpet",
        message: message,
        route: "v3",
        numbers: phoneNumber,
      },
      {
        headers: {
          authorization: SMS_ID,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("Error while sending SMS.", error?.message ?? error);
    throw error;
  }
}

async function smsSignupOTP(phoneNumber, otp, hash = "") {
  const message = `${otp} is your Signup OTP, Welcome to MYTY. ${hash}`;
  try {
    const data = await smsRequst(phoneNumber, message);
  } catch (error) {
    console.log(
      "Error while processing for Signup OTP.",
      error?.message ?? error
    );
    throw error;
  }
}

async function smsLoginOTP(phoneNumber, otp, hash = "") {
  const message = `${otp} is your Login OTP, Welcome to MYTY. ${hash}`;
  try {
    const data = await smsRequst(phoneNumber, message);
  } catch (error) {
    console.log(
      "Error while processing for Signup OTP.",
      error?.message ?? error
    );
    throw error;
  }
}

module.exports = {
  smsOtp,
  smsSignupOTP,
  smsLoginOTP,
};
