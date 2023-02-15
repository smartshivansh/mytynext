const express = require("express");
const cors = require("cors");
const userAnalytics = require("./middleware/userAnalytics");
const path = require("path");
const mongoose = require("mongoose");
const config = require("config");
const PORT = process.env.PORT || config.get("port");
const HOST = config.get("host");
const sockets = require("./socket_copy");
const { watchingByTypesense } = require("./utils/typesense/actions");

const app = express();

app.use(express.json());

const allowlist = [
  "https://doornext.in",
  "https://www.doornext.in",
  "https://doornextm.in",
  "https://www.doornextm.in",
  "http://localhost:8080",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://anurag.doornextm.in",
  "https://namandubeysample.doornextm.in",
  "https://s3.ap-south-1.amazonaws.com",
];
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};
app.use(cors(corsOptionsDelegate));

mongoose
  .connect(config.get("mongoURI"), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(async (client) => {
    console.log("MongoDB Connected.👍");
  })
  .catch((err) => console.log("MongoDB could not connect!🚨", err.message));

const usersRoute = require("./server/api/routes/users");
app.use("/api", usersRoute);

const paymentRoute = require("./server/api/routes/payment");
app.use("/api/payment", paymentRoute);

// reworked
const authRoute = require("./server/api/routes/auth");
app.use("/api/auth", authRoute);
// reworked end
const chatRoute = require("./server/@next/chat");
app.use("/api/chat", chatRoute);
// rework ongoing
const linkRoute = require("./server/api/routes/link");
app.use("/api/link", linkRoute);
const websiteApiRoute = require("./server/api/routes/website-api");
app.use("/api/website", websiteApiRoute);
// rework new

const domainRouting = require("./server/api/routes/domain");
app.use("/api/domain", domainRouting);

const uploadRoute = require("./server/api/routes/upload");
app.use("/api/upload", uploadRoute);

const recaptchaRoute = require("./server/api/routes/recaptcha");
app.use("/api/recaptcha", recaptchaRoute);

const navbarRoute = require("./server/api/routes/navigationbar/navbar");
app.use("/api/navbar", navbarRoute);

const themeRoute = require("./server/api/routes/theme");
app.use("/api/theme", themeRoute);

const pagesRoute = require("./server/api/routes/pages/pages");
app.use("/api/pages", pagesRoute);

const profilecardRoute = require("./server/api/routes/profilecard/profilecard");
app.use("/api/profilecard", profilecardRoute);

const blogRoute = require("./server/api/routes/blog/blog");
app.use("/api/blog", blogRoute);

const imagePostRoute = require("./server/api/routes/imagepost");
app.use("/api/image-post", imagePostRoute);
const videoPostRoute = require("./server/api/routes/videopost");
app.use("/api/video-post", videoPostRoute);
const quotePostRoute = require("./server/api/routes/quotepost");
app.use("/api/quote-post", quotePostRoute);
const linkPostRoute = require("./server/api/routes/linkpost");
app.use("/api/link-post", linkPostRoute);

const scoRoute = require("./server/api/routes/seo");
app.use("/api/seo", scoRoute);

const locationRoute = require("./server/api/routes/location");
app.use("/api/location", locationRoute);

const QrUploadRoute = require("./server/api/routes/qrUpload");
app.use("/api/upload/qr", QrUploadRoute);
app.use("/api/qr-code", require("./server/api/routes/qr-code"));

const betaUserRoute = require("./server/api/routes/beta");
app.use("/api/beta", betaUserRoute);

const invitecode = require("./server/api/routes/invitecode");
app.use("/api/invitecode", invitecode);

const analyticsRoute = require("./server/api/routes/analytics/index");
app.use("/api/analytics", analyticsRoute);

const likesRoute = require("./server/api/routes/Likes");
app.use("/api/likes", likesRoute);

const feedsRoute = require("./server/api/routes/feeds");
app.use("/api/feeds", feedsRoute);

app.use("/api/search", require("./server/api/routes/search"));

app.use("/api/admin", require("./server/api/routes/admin"));
app.use("/api/redis-cache", require("./server/api/routes/redis"));

app.use(
  "/api/chat-notification",
  require("./server/api/routes/chatNotification")
);

app.use("/uploads", express.static("uploads"));

app.use("/sitemap", require("./server/api/routes/seo/index"));


app.use(express.static("build"));
app.get("/*", (req, res) => {
  // console.log("host", config.get("host"));
  res.sendFile(path.resolve(__dirname, "build/index.html"));
});

const server = app.listen(PORT, () =>
  console.log(`server is running on ${Url}`)
);

//socket.init(server);
sockets.init(server);

// const Url = `http://${HOST}`;
const Url = `http://localhost:${PORT}`;
// console.log(Url);
exports.Url = Url;
