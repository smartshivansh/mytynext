const nodemailer = require("nodemailer");
const config = require("config");
const welcomeTemp = require("./templates/welcome");
const otpTemp = require("./templates/otp");
const mytyBot = require("../../../middleware/mytyBot");
const mailer_auth = {
  user: "apikey",
  pass: config.get("sendgrid_pwd"),
};

const transport = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 25,
  secure: false,
  service: "SendGrid",
  requireTLS: false,
  auth: mailer_auth,
});

function MailSignupOTP(recipient_email, otp) {
  const mailOptions = {
    from: "in@myty.in",
    to: recipient_email,
    subject: "OTP from myty",
    html: otpTemp(otp),
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('Error from sending OTP' + err);
    } else {
      console.log(`Mailed ${otp} to ${recipient_email}.`);
    }
  });

  console.log(`OTP= ${otp} EMAIL ${recipient_email}.`);
}

function MailForgotOTP(recipient_email, otp) {
  const mailOptions = {
    from: "in@myty.in",
    to: recipient_email,
    subject: "OTP",
    html: otpTemp(otp),
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    }
  });

  console.log(`Mailed ${otp} to ${recipient_email}.`);
}

function WelcomeMail(recipient_email) {
  const mailOptions = {
    from: "in@myty.in",
    to: recipient_email,
    subject: "Welcome to myty",
    html: welcomeTemp(),
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    }
  });
  mytyBot(`Welcome mailed to ${recipient_email}.`);
  console.log(`Mailed to ${recipient_email}.`);
}

function PlanRequestEmailToAdmins(userInfo, plan) {
  const data = {
    userInfo,
    plan,
  };

  const mailOptions = {
    from: "in@myty.in",
    to: "care@myty.in",
    subject: "User requested for Plan Upgrade.",
    text: JSON.stringify(data, null, 2),
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    }
  });

  mytyBot(`User upgrade request mailed to care@myty.in.`);
  console.log(`Mailed to care@myty.in.`);
}

function PlanRequestEmailToUser(recipient_email, plan) {
  console.log("Sending mail to user");
  console.log(recipient_email, plan);

  const mailOptions = {
    from: "in@myty.in",
    to: recipient_email,
    subject: "Plan Upgrade request confirmation.",
    text: `Your request to Upgrade to Plan - ${JSON.stringify(
      plan,
      null,
      2
    )} is Being Proceed.`,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    }
  });

  mytyBot(`User upgrade request confirmation mailed to ${recipient_email}.`);
  console.log(`Mailed to ${recipient_email}.`);
}

function planUpgradeEmailToUser(userInfo) {
  const recipient_email = userInfo.email;
  const mailOptions = {
    from: "in@myty.in",
    to: recipient_email,
    subject: "Plan Upgrade confirmation.",
    text: `Your request to upgrade to Plan - ${userInfo.plan} is confirmed and applied.`,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      mytyBot(
        `Some error occured confirming User Plan Upgrade email to ${recipient_email}.`
      );
    }
  });
  mytyBot(`User upgrade confirmation mailed to ${recipient_email}.`);
}

function planUpgradeEmailToAdmins(userInfo) {
  const recipient_email = "care@myty.in";
  const mailOptions = {
    from: "in@myty.in",
    to: "care@myty.in",
    subject: "Plan Upgrade confirmation.",
    text: `${userInfo.name} requestd to upgrade to Plan - ${userInfo.plan
      }. Checkout latest payment Info ${JSON.stringify(
        userInfo.paymentInfo,
        null,
        2
      )}`,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      mytyBot(
        `Some error occured confirming User Plan Upgrade email to ${recipient_email}.`
      );
    }
  });
  mytyBot(
    `Admins are notified about User upgrade confirmation mailed to ${recipient_email}.`
  );
}

function requestEnterprisePlanEmailToAdmins(userInfo) {
  const recipient_email = "care@myty.in";
  const mailOptions = {
    from: "in@myty.in",
    to: "care@myty.in",
    subject: "Enterprise Custom plan requested.",
    text: `${userInfo.name
      } requestd to upgrade to Plan - Enterprise. User Info ${JSON.stringify(
        userInfo,
        null,
        2
      )}`,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      mytyBot(
        `Some error occured confirming User Plan Request to Enterprise email to ${recipient_email}.`
      );
    }
  });
  mytyBot(
    `Admins are notified about User upgrade confirmation mailed to ${recipient_email}.`
  );
}
function requestEnterprisePlanEmailToUser(userInfo) {
  const recipient_email = userInfo.email;
  const mailOptions = {
    from: "in@myty.in",
    to: recipient_email,
    subject: "Enterprise Custom plan requested.",
    text: `Your request to upgrade to Plan - Enterprise is received and being proceed. You'll soon receive a mail with the details.`,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      mytyBot(
        `Some error occured confirming User Plan Request to Enterprise email to ${recipient_email}.`
      );
    }
  });
  mytyBot(`User upgrade confirmation mailed to ${recipient_email}.`);
}

module.exports = {
  MailSignupOTP,
  MailForgotOTP,
  WelcomeMail,
  PlanRequestEmailToUser,
  PlanRequestEmailToAdmins,
  planUpgradeEmailToUser,
  planUpgradeEmailToAdmins,
  requestEnterprisePlanEmailToUser,
  requestEnterprisePlanEmailToAdmins,
};