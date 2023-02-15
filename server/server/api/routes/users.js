const express = require("express");
const axios = require("axios");
const qs = require("qs");
//For Email Validation

//For the OTP
var rn = require("random-number");
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
const auth = require("../../../middleware/auth");
const mytyBot = require("../../../middleware/mytyBot");
var expiryDurationOtp = config.get("expiry-duration-otp");
var Signup = require("../../../models/Signup");
var User = require("../../../models/User");
const {
  MailSignupOTP,
  MailForgotOTP,
  PlanRequestEmailToAdmins,
  PlanRequestEmailToUser,
} = require("../services/OTPMailServices");
const { smsOtp } = require("../services/smsOtpServices");

const { getCookieDomain } = require("../services/cookieService");
const Blog = require("../../../models/BlogSchema");

const router = express.Router();

router.post("/signup", async (req, res) => {
  // // log the req
  // if (!req.body.email) {
  //   res.json({ msg: "EMAIL_EMPTY" });
  //   return;
  // }

  const { email, invite } = req.body;

  // let isValidEmail = validator.validate(req.body.email);
  let isValidEmail = true;
  if (!isValidEmail) {
    mytyBot(req.originalUrl, req.body, "EMAIL_INVALID");
    res.status(400).send({ msg: "EMAIL_INVALID" });
    return;
  } else {
    User.findOne({ email: req.body.email }).then(async (user) => {
      if (!user) {
        var options = {
          min: 100000,
          max: 999999,
          integer: true,
        };
        var otp = rn(options);

        // ! check invite code validation
        // console.log(invite);
        // const beta_res = await axios.post(
        //   `https://beta-user.herokuapp.com/login`,
        //   qs.stringify({ code: invite })
        // );

        // if (beta_res.error) {
        //   res.status(401).send({
        //     msg: "WRONG_CODE",
        //   });
        // } else {
        const newSignup = new Signup({
          email: req.body.email,
          verified: false,
          otp: otp,
        });

        newSignup.save((error) => {
          if (error) {
            // res.status(400).send({ msg: "EMAIL_ALREADY_EXIST" });
            Signup.findOneAndUpdate(
              { email: req.body.email },
              { otp: otp.toString() },
              (err, results) => {
                if (!err) {
                  MailSignupOTP(req.body.email, otp);
                  mytyBot(req.originalUrl, otp, "EMAIL_VERIFICATION_OTP_SENT");
                  console.log(otp);
                  return res.send({
                    msg: "EMAIL_VERIFICATION_OTP_SENT",
                    otp,
                  });
                }
              }
            );
          } else {
            MailSignupOTP(req.body.email, otp);
            mytyBot(req.originalUrl, otp, "EMAIL_VERIFICATION_OTP_SENT");
            console.log(otp);
            res.send({ msg: "EMAIL_VERIFICATION_OTP_SENT", otp });
          }
        });
        // }
      } else {
        mytyBot(req.originalUrl, "", "EMAIL_ALREADY_EXIST");
        res.status(400).send({ msg: "EMAIL_ALREADY_EXIST" });
      }
    });

    return;
  }
});

router.post("/otp", (req, res) => {
  if (!req.body.email) {
    // mytyBot(req.originalUrl, "", "EMAIL_EMPTY");
    res.json({ msg: "EMAIL_EMPTY" });
    return;
  }
  Signup.findOneAndUpdate(
    { email: req.body.email, otp: req.body.otp },
    { verified: true, updated_at: Date.now() },
    (err, result) => {
      if (err) {
        // mytyBot(req.originalUrl, "", err);
        throw err;
      }
      // console.log(result);
      if (result == null) {
        // mytyBot(req.originalUrl, "", "OTP_UNMATCHED");

        res.send({ msg: "OTP_UNMATCHED" });
      } else {
        // mytyBot(req.originalUrl, "", "OTP_MATCHED");
        res.send({ msg: "OTP_MATCHED" });
        //Next Step is to set password. But that all wiil go to Users Collection.
        //The signup collection is only for doing the OTP/Verification purpose.
      }
    }
  );
});

router.post("/password", (req, res) => {
  const { name, email, password, username, userlink } = req.body;
  if (!name || !email || !password) {
    // mytyBot(req.originalUrl, "", "FIELDS_ARE_EMPTY");
    return res.status(400).json({ msg: "FIELDS_ARE_EMPTY" });
  }
  //need to add the signup db check if its verified or not - work for @SahilSeli
  User.findOne({ email }).then((user) => {
    if (user) {
      // mytyBot(req.originalUrl, "", "USER_ALREADY_EXIST");
      return res.status(400).json({ msg: "USER_ALREADY_EXIST" });
    }
    const newUser = new User({
      name,
      email,
      password,
      username,
      userlink,
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        // here id is creating the issues
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },
            config.get("jwtSecret"),
            { expiresIn: "7d" },
            (err, token) => {
              if (err) {
                // mytyBot(req.originalUrl, "", err);
                throw err;
              }
              res.json({
                token,
                user: {
                  _id: user.id,
                  name: user.name,
                  email: user.email,
                  username: user.username,
                  userlink: user.userlink,
                },
              });
            }
          );
        });
      });
    });
  });
});

router.post("/login", async (req, res) => {
  const { email, password, mobile } = req.body;
  console.log(email, password);

  if ((!email && !mobile) || !password) {
    console.log("null ran");
    // mytyBot(req.originalUrl, "", "EMAIL_PASSWORD_MOBILE_EMPTY");
    return res.status(400).json({ msg: "EMAIL_MOBILE_PASSWORD_EMPTY" });
  }

  const user = mobile
    ? await User.findOne({ mobile })
    : await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: "USER_DOES_NOT_EXIST" });
  }

  bcrypt.compare(password, user.password).then((isMatch) => {
    if (!isMatch) {
      console.log("not-matched");
      // mytyBot(req.originalUrl, "", "INVALID_PASSWORD");
      return res.status(400).json({ msg: "INVALID_PASSWORD" });
    }

    console.log("matched");
    // const token = jwt.sign({ id: user.id }, config.get("jwtSecret"), {
    //   expiresIn: "7d",
    // });
    // res.cookie(`token`, token, {
    //   domain: getCookieDomain(),
    //   path: "/",
    // });
    // res.status(200).send({
    //   token,
    //   user: user,
    // });

    jwt.sign(
      { id: user.id },
      config.get("jwtSecret"),
      { expiresIn: "7d" },
      (err, token) => {
        console.log("Ok");
        if (err) {
          console.log(err);
          throw err;
        }
        res.cookie(`token`, token, {
          domain: getCookieDomain(),
          path: "/",
        });
        res.status(200).send({
          token,
          user: user,
        });
      }
    );
  });
});

router.post("/forgot-password", (req, res) => {
  const { email, mobile } = req.body;

  if (mobile) {
    User.findOne({ mobile })
      .then((user) => {
        if (!user) {
          return res.status(400).send({ msg: "USER_DOES_NOT_EXIST" });
        } else {
          let options = {
            min: 100000,
            max: 999999,
            integer: true,
          };
          const otp = rn(options);

          Signup.findOneAndUpdate(
            { mobile: mobile },
            { otp: otp.toString() },
            (err, res) => {}
          );

          mytyBot(
            `Recovery verification sending ${otp} to ${req.body.mobile}.`
          );
          // MailForgotOTP(req.body.mobile, otp);
          smsOtp(otp, req.body.mobile, (hash = req.body?.hash ?? ""));

          console.log(otp);

          res.send({
            msg: "otp sent to mobile",
          });
        }
      })
      .catch((err) => {
        err.send({
          msg: "MOBILE_DOES_NOT_EXISTS",
        });
      });
  }
  if (email) {
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.status(400).send({ msg: "USER_DOES_NOT_EXIST" });
        } else {
          let options = {
            min: 100000,
            max: 999999,
            integer: true,
          };
          const otp = rn(options);

          Signup.findOneAndUpdate(
            { email: email },
            { otp: otp.toString() },
            (err, res) => {}
          );

          mytyBot(`Recovery verification mailing ${otp} to ${req.body.email}.`);
          MailForgotOTP(req.body.email, otp);
          console.log(otp);

          res.send({
            msg: "otp sent to email",
          });
        }
      })
      .catch((err) => {
        err.send({
          msg: "EMAIL_DOES_NOT_EXISTS",
        });
      });
  }
});

router.post("/reset-otp", (req, res) => {
  const { email, mobile, otp } = req.body;

  if (email) {
    Signup.findOne(
      { email: email, otp: otp },

      (err, result) => {
        if (err) {
          throw err;
        }
        if (result == null) {
          res.send({ msg: "OTP_UNMATCHED" });
        } else {
          res.send({ msg: "OTP_MATCHED" });
        }
      }
    );
  }
  if (mobile) {
    Signup.findOne(
      { mobile: mobile, otp: otp },

      (err, result) => {
        if (err) {
          throw err;
        }
        if (result == null) {
          res.send({ msg: "OTP_UNMATCHED" });
        } else {
          res.send({ msg: "OTP_MATCHED" });
        }
      }
    );
  }
});

router.post("/reset-password", (req, res) => {
  const { email, mobile, password } = req.body;
  if (email) {
    User.findOne({ email })
      .then((user) => {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
              throw err;
            }
            user.password = hash;

            user.save().then(() => {
              res.send({
                msg: "PASSWORD_UPDATED",
              });
            });
          });
        });
      })
      .catch((err) => {
        res.send({});
      });
  }
  if (mobile) {
    User.findOne({ mobile })
      .then((user) => {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
              throw err;
            }
            user.password = hash;

            user.save().then(() => {
              res.send({
                msg: "PASSWORD_UPDATED",
              });
            });
          });
        });
      })
      .catch((err) => {
        res.send({});
      });
  }
});

router.post("/refresh-token", async (req, res) => {
  const token = req.header("x-auth-token");

  try {
    const { id } = jwt.verify(token, config.get("jwtSecret"));

    if (!id) {
      // mytyBot(req.originalUrl, "", "id not found");
      res.sendStatus(404);
    }

    const newToken = jwt.sign({ id }, config.get("jwtSecret"), {
      expiresIn: "7d",
    });
    // mytyBot(req.originalUrl, "", "newToken is sent");
    res.status(200).send({
      token: newToken,
    });
  } catch (JsonWebTokenError) {
    res.sendStatus(401);
  }
});

router.post("/change-password/verify", auth, async (req, res) => {
  const { id } = req.user;
  const { data } = req.body;
  // console.log({ id, data });
  if (!id) {
    // mytyBot(req.originalUrl, "", "unauthorized");
    res.sendStatus(401); // unauthorized
  } else {
    const resultUser = await User.findById(id);
    // console.log(resultUser);

    if (!resultUser) {
      // mytyBot(req.originalUrl, "", "not-found");

      res.sendStatus(404); // not-found
    } else {
      const resultCompare = await bcrypt.compare(data, resultUser.password);
      // console.log(resultCompare);

      if (resultCompare) {
        // mytyBot(req.originalUrl, "", "accepted");
        res.sendStatus(202); // accepted
      } else {
        // mytyBot(req.originalUrl, "", "not-acceptable");
        res.sendStatus(406); // not-acceptable
      }
    }
  }
});
router.post("/change-password/reset", auth, async (req, res) => {
  const { id } = req.user;
  const { data } = req.body;
  // console.log({ id, data });
  if (!id) {
    // mytyBot(req.originalUrl, "", "unauthorized");
    res.sendStatus(401); // unauthorized
  } else {
    let resultUser = await User.findById(id);
    // console.log(resultUser);

    if (!resultUser) {
      // mytyBot(req.originalUrl, "", "not-found");
      res.sendStatus(404); // not-found
    } else {
      const resultCompare = await bcrypt.compare(data, resultUser.password);
      // console.log(resultCompare);

      if (resultCompare) {
        // mytyBot(req.originalUrl, "", "method-not-allowed");
        res.sendStatus(405); // method-not-allowed
      } else {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(data, salt);
        // console.log({ salt, hash });

        await User.findByIdAndUpdate(id, { password: hash }, { new: true });
        // mytyBot(req.originalUrl, "", "password-changed");
        res.sendStatus(200);
      }
    }
  }
});

router.get("/user", auth, async (req, res) => {
  const { user, body } = req;
  // console.log(user);
  const _user = await User.findById(user.id).select("-password -paymentInfo");

  if (!_user) {
    // mytyBot(req.originalUrl, "", "user not found");
    throw res.send({ msg: "user not found" });
  }
  // mytyBot(req.originalUrl, _user, "found");

  const token = req.header("x-auth-token");
  res.cookie(`token`, token, {
    domain: getCookieDomain(),
    path: "/",
  });
  res.status(200).send({ user: _user });
});

router.get("/user/findby", async (req, res) => {
  console.log("user find", req.header);
  const username = req.query.username;

  let user = await User.findOne({ username: username });

  if (!user) {
    // mytyBot(req.originalUrl, "", "USER_NOT_FOUND");
    res.status(200).send({
      msg: "USER_NOT_FOUND",
    });
  } else {
    user.password = null;
    // mytyBot(req.originalUrl, user, "USER_FOUND");
    res.status(200).send({
      msg: "USER_FOUND",
      user: user,
    });
  }
});

router.get("/user/subdomain", async (req, res) => {
  console.log("user subdomain", req.header);
  const subdomain = req.query.subdomain;

  let user = await User.findOne({ subdomain });

  if (!user) {
    // mytyBot(req.originalUrl, "", "USER_NOT_FOUND");
    res.status(200).send({
      msg: "USER_NOT_FOUND",
    });
  } else {
    user.password = null;
    // mytyBot(req.originalUrl, user, "USER_FOUND");
    res.status(200).send({
      msg: "USER_FOUND",
      user: user,
    });
  }
});

router.post("/user/qrcode", auth, async (req, res) => {
  const { id } = req.user;
  const { qrcode } = req.body;
  // console.log({ id, qrcode });

  const resultUser = await User.findByIdAndUpdate(
    id,
    { qrcode },
    { new: true }
  );

  res.send({
    resultUser,
  });
});

router.get("/user/qrcode", (req, res) => {
  console.log(data);
});

router.post("/user/request-plan", async (req, res) => {
  const { email, name, phone, plan } = req.body;

  try {
    mytyBot(`User upgrade request mailed to care@myty.in.`);
    mytyBot(`User upgrade request confirmation mailed to ${email}.`);

    await PlanRequestEmailToAdmins({ email, name, phone }, plan);
    await PlanRequestEmailToUser(email, plan);
    res.sendStatus(200);
  } catch (error) {}
});

router.get("/alluser/subdomain", async (req, res) => {
  let user = await User.find({ subdomain: { $nin: [null, ""] } }).select(
    "subdomain -_id"
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${user
      .map((data) => {
        return `
          <url>
            <loc>https://${data.subdomain}.myty.in</loc>
            <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
            <changefreq>daily</changefreq>
            <priority>1.0</priority>
          </url>
        `;
      })
      .join("")}
  </urlset>
`;

  if (!user) {
    res.status(200).send({
      msg: "USER_NOT_FOUND",
    });
  } else {
    res.setHeader("Content-Type", "text/xml");
    res.end(sitemap);
  }
});

router.get("/alluser/blogs", async (req, res) => {
  const blog = await Blog.find({ published: true }).select("slug");

  console.log("sitemap blogs", blog);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${blog
        .map((data) => {
          return `
            <url>
              <loc>https://myty.in/blog/${data.slug}</loc>
              <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
              <changefreq>daily</changefreq>
              <priority>1.0</priority>
            </url>
          `;
        })
        .join("")}
    </urlset>
  `;

  if (!blog) {
    res.status(200).send({
      msg: "USER_NOT_FOUND",
    });
  } else {
    res.setHeader("Content-Type", "text/xml");
    res.end(sitemap);
  }
});

module.exports = router;
