const authErrors = {
  invalidCode: { code: 400, message: "CODE_NOT_AVAILABLE" },
  duplicateEmail: { code: 400, message: "DUPLICATE_EMAIL" },
  duplicateMobile: { code: 400, message: "DUPLICATE_MOBILE" },
  duplicateUsername: { code: 400, message: "DUPLICATE_USERNAME" },
  invalidEmail: { code: 400, message: "INVALID_EMAIL" },
  otpMismatch: { code: 400, message: "OTP_MISMATCH" },
  unverifiedEmail: { code: 400, message: "UNVERIFIED_EMAIL" },
  noUserFound: { code: 404, message: "NO_USER_FOUND" },
  unknownError: { code: 500, message: "UNKNOWN_ERROR" },
  otpSMSFailed: { code: 503, message: "OTP_FAILED" },
  otpEmailFailed: { code: 503, message: "EMAIL_FAILED" },
};

function getErrorCodeByMessage(message) {
  const keys = Object.keys(authErrors);
  const match = keys.find((key) => {
    return authErrors[key].message === message;
  });
  return authErrors[match]?.code;
}

function getErrorByMessage(message) {
  const keys = Object.keys(authErrors);
  const match = keys.find((key) => {
    return authErrors[key].message === message;
  });

  return authErrors[match]?.message;
}

module.exports = { authErrors, getErrorCodeByMessage, getErrorByMessage };
