const host = require("config").get("host");

function getCookieDomain() {
  if (host === "localhost") {
    return null;
  }

  return `.${host}`;
}

module.exports = { getCookieDomain };
