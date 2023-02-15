const Blogs = require("../../../../../models/BlogSchema");

async function getBlogs({ orderBy, desec = 1, limit = 10, page = 1 }) {
  const publishedQuery = { published: true, drafted: false };
  const sortByDate = { last_update_date: desec };

  let sortBy;
  switch (orderBy) {
    case "date":
      sortBy = sortByDate;
      break;

    default:
      break;
  }

  // console.log({ orderBy, desec, limit, page });

  return await Blogs.find(publishedQuery)
    .sort(sortBy)
    .limit(limit)
    .skip((page - 1) * limit);
  // * (page-1) is just offset fix
  // return null;
}

async function addToFeeds(id) {
  return await Blogs.findByIdAndUpdate(
    id,
    { feeds: true },
    { new: true, upsert: true }
  );
}

async function removeFromFeeds(id) {
  return await Blogs.findByIdAndUpdate(
    id,
    { feeds: false },
    { new: true, upsert: true }
  );
}

module.exports = { getBlogs, addToFeeds, removeFromFeeds };
