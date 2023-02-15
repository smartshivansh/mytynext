const express = require("express");
const router = express.Router();
const path = require("path");
const redis = require("redis");

const redisClient = redis.createClient();
redisClient.on("error", (err) => {
  console.log("redis did not connect 🚨/redis-cache\n", err.message);
  redisClient.quit();
});

redisClient.on("connect", () => {
  console.log("Redis  Connected.👍");
});
// redisClient.on("reconnecting", () => {
//   console.log("Redis reconnecting 🔁");
// });

router.get("/", async (req, res) => {
  try {
    const { key } = req.body;
    console.log("keys", key);
    const data = await getCache(key);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400);
  }
});
router.get("/all", async (req, res) => {
  redisClient.keys("*", function (err, keys) {
    if (err) return console.log(err);
    if (keys) {
      res.send(keys);
    }
  });
});

router.delete("/", async (req, res) => {
  try {
    const { key } = req.body;
    console.log("keys", key);
    const data = await deleteCache(key);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400);
  }
});

function getCache(key, cb) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (error, data) => {
      if (error) {
        return reject(data);
      }

      if (data != null) {
        console.log("Cache Hit");
        return resolve(JSON.parse(data));
      }
    });
  });
}

function deleteCache(key, cb) {
  return new Promise((resolve, reject) => {
    redisClient.del(key, async (error, data) => {
      if (error) {
        return reject(data);
      }

      if (data != null) {
        console.log("Cache Hit");
        return resolve(JSON.parse(data));
      }
    });
  });
}

module.exports = router;
