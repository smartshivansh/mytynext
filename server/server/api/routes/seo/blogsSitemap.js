const express = require("express");
const router = express.Router();
const User = require("../../../../models/User");
const moment = require("moment");

router.get("/", async (req, res) => {
  const blog = await User.aggregate([
    {
      $match: {
        subdomain: {
          $nin: [null, ""],
        },
      },
    },
    { $sort: { register_date: -1 } },

    {
      $lookup: {
        from: "temp_blogs",
        localField: "_id",
        foreignField: "user_id",
        as: "blogs",
      },
    },
    {
      $match: {
        "blogs.published": false,
      },
    },

    {
      $project: {
        "blogs.slug": 1,
        "blogs.published": 1,
        "blogs.updatedAt": 1,
        subdomain: 1,
      },
    },
  ]);

  if (blog) {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${blog
        .map((user) => {
          // console.log("user in map ", user);
          return user.blogs
            .map((data) => {
              // console.log("data in map ", data);
              return data.published
                ? `
            <url>
              <loc>https://${user.subdomain}.myty.in/blog/${data.slug}</loc>
              <lastmod>${moment(data.updatedAt)?.format("YYYY-MM-DD")}</lastmod>
              <changefreq>daily</changefreq>
              <priority>1.0</priority>
            </url>
          `
                : null;
            })
            .join("");
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
  } else {
    console.log("else ran");
    res.sendFile(__dirname + "/sitemap.xml");
  }
});

module.exports = router;
