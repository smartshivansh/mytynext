const jwt = require("jsonwebtoken");

function analyticsAuth(req, res, next) {
  const authorization = req.header("Authorization");

  const token = authorization.split(" ")[1];

  const secret = "secret-for-analytics-token";

  try {
    const decode = jwt.verify(token, secret);
    next();
  } catch (err) {
    res.sendStatus(403);
  }
}

module.exports = analyticsAuth;
