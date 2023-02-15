const axios = require("axios");
const config = require("config");

const mytyBot = async (path, data, message) => {
  const dataToSend = JSON.stringify({
    env: config.get("env"),
    path,
    data,
    message,
  });
  try {
    if (config.get("env") === "dev" || config.get("env") === "DEV" || config.get("env") === "development") return;

    const data = await axios.post(
      "https://hooks.slack.com/services/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",
      { text: dataToSend }
    );
    console.log("mytyBOT🤖 connected👍.", dataToSend);
  } catch (err) {
    console.log("some error occured during connecting the bot.");
  }
};

module.exports = mytyBot;