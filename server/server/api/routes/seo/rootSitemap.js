const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
              <sitemap>
              <loc>https://myty.in/sitemap/users/subdomain.xml</loc>
              <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
              </sitemap>
              <sitemap>
              <loc>https://myty.in/sitemap/users/blogs.xml</loc>
              <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
              </sitemap>
          
  </sitemapindex>`;

  res.setHeader("Content-Type", "text/xml");
  res.end(sitemap);
});

module.exports = router;
