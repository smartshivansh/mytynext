const express = require("express");
const UserAnalytics = require("../../../../models/UserAnalytics");

const Router = express.Router();

Router.get("/:hostname", async (req, res) => {
  console.log(req.params.hostname);
  const { hostname } = req.params;
  console.log("userAnalyticsSlice ran");
  const data = await UserAnalytics.aggregate([
    {
      $match: {
        createdAt: {
          $exists: true,
          $ne: null,
        },
        hostname,
      },
    },
    {
      $group: {
        _id: {
          date: "$createdAt",
          visitor_status: "$visitor_status",
          hostname: "$hostname",
        },
        visitor: {
          $sum: { $cond: [{ $eq: ["$visitor_status", "new"] }, 1, 0] },
        },
        created: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$_id.date" } },
        created: { $sum: 1 },
        visitorcount: {
          $sum: { $cond: [{ $eq: ["$visitor", 1] }, 1, 0] },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  res.status(200).send(data);
});

module.exports = Router;

// [
//   {
//     $match: {
//       createdAt: {
//         $exists: true,
//         $ne: null,
//       },
//     },
//   },
//   ,
//   {
//     $group: {
//       _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//       created: { $sum: 1 },
//     },
//   },
//   { $sort: { _id: 1 } },
// ]
