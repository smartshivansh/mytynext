const redis = require("redis");
const redisClient = redis.createClient();

redisClient.on("error", (err) => {
  console.log("redis did not connect  🚨/website-api\n", err.message);
  redisClient.quit();
});

redisClient.on("connect", () => {
  console.log("Redis - Website API Connected.👍");
});
redisClient.on("reconnecting", () => {
  console.log("Redis reconnecting 🔁");
});

const WEBSITE_DATA_EXPIRATION = 5 * 60;

function lookupFromCache(key) {
  // try {
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (err, data) => {
      if (err) {
        console.log("error in lookupFromCache");
        return resolve(null);
      }
      if (data) {
        console.log("data found in cache");

        return resolve(JSON.parse(data));
      } else {
        return resolve(null);
      }
    });
  });
  // if (data) {
  //   console.log("data found in cache");
  //   return JSON.parse(data);
  // } else {
  //   console.log("data not found in cache");
  //   return null;
  // }
  // } catch (error) {
  //   console.log("error in lookupFromCache");
  //   return null;
  // }
}

async function saveToCache(key, data) {
  try {
    console.log("data saving in cache");
    await redisClient.setex(key, WEBSITE_DATA_EXPIRATION, JSON.stringify(data));
  } catch (error) {
    // console.log("error in saveToCache", error.message);
  }
}

module.exports = { lookupFromCache, saveToCache };
