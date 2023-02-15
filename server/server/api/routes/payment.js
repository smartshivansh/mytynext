const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const config = require("config");
const Router = express.Router();

const instance = new Razorpay({
  key_id: config.get("razorpay_key_id"),
  key_secret: config.get("razorpay_key_secret"),
});

// multiplier for generating
// const multi = 1; // test mode set for 1paise
// const multi = 100; // Indian Rupee = 100paise (smallest unit of currency)
const multi = config.get("currency_multiplier");
const tax = config.get("tax_multiplier");

Router.get("/create-order/:planName", async (req, res) => {
  console.log("Creating order for", req.params.planName);

  let options = {
    amount: null,
    currency: "INR",
    receipt: "",
  };

  if (!req.params.planName) {
    res.sendStatus(404);
    return;
  }

  switch (req.params.planName) {
    case "rs-1-plan":
      options.amount = Math.round(30 * multi * tax);
      options.receipt = "myty_rs_1_plan";
      break;

    case "basic":
      options.amount = Math.round(499 * multi * tax);
      options.receipt = "myty_basic_plan";
      break;

    case "premium":
      options.amount = Math.round(999 * multi * tax);
      options.receipt = "myty_premium_plan";
      break;

    default:
      res.sendStatus(404);
      return;
      break;
  }

  try {
    const order = await instance.orders.create(options);
    res.status(200).send(order);
  } catch (error) {
    res.status(400).send("Something went wrong with payment server.");
  }
});

Router.post("/verify-response", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const secret = config.get("razorpay_key_secret");

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = shasum.digest("hex");

  if (digest == razorpay_signature) {
    console.log("payment response verified");
  } else {
    res
      .status(400)
      .send(
        "payment response verification failed, wait for a while for webhook to be triggered"
      );
  }

  instance;
  res.status(200).send("payment response verified");
});

Router.post("/verify-webhook", async (req, res) => {
  // webhook secret
  const secret = "MyTyRazorpayWebhook";

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("payment Webhook verified");
  }
  res.json({ status: "ok" });
});

module.exports = Router;
