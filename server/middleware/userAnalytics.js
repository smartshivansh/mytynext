const moment = require("moment");

const userAnalytics = (req, res, next) => {
  // const ip = req.headers["x-forwarded-for"];

  // console.log("ip", ip);

  // console.log(
  //   "middleware userAnalytics ran",
  //   "remote address",
  //   req?.header("X-Real-IP"),
  //   "Host",
  //   req?.header("Host"),
  //   "req.socket.remoteAddress",
  //   req?.socket?.remoteAddress,
  //   "req.connection.socket.remoteAddress",
  //   req?.connection?.socket?.remoteAddress,
  //   "req.info.remoteAddress",
  //   req?.info?.remoteAddress
  // );

  //   if (err) {
  //     console.log("error occured ", err.message);
  //   }

  let requestTime = Date.now();
  let goodTime = new Date().toISOString().slice(0, 10);
  res.on("finish", () => {
    if (req.path === "/analytics") {
      return;
    }
    console.log("analytics data ", {
      Request_URL: req.originalUrl,
      url: req.path,
      method: req.method,
      goodTime,
      responseTime: (Date.now() - requestTime) / 1000, // convert to seconds
      day: moment(requestTime).format("dddd"),
      hour: moment(requestTime).hour(),
      time_simple: moment(requestTime).format("LLLL"),
      time_quote: moment(requestTime).format("DD-MMMM-YYYY, h:mm:ss a"),
    });
  });
  next();
};

module.exports = userAnalytics;
