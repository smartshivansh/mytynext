const express = require("express");
const router = express.Router();
const moment = require("moment");

const User = require("../../../../models/User");

router.get("/", async (req, res) => {
  let user = [];
  try {
    user = await User.find({ subdomain: { $nin: [null, ""] } })
      .sort({ createdAt: -1 })
      // .sort({ $or: [{ createdAt: -1 }, { updatedAt: -1 }] })
      .select("subdomain -_id createdAt");
  } catch (err) {
    res.sendStatus(404);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${user
        .map((data) => {
          return `
            <url>
              <loc>https://${data.subdomain}.myty.in</loc>
              <lastmod>${moment(data.createdAt)?.format("YYYY-MM-DD")}</lastmod>
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

module.exports = router;
