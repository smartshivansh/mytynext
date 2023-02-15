const Typesense = require("typesense");
const User = require("../../models/User");
const Blog = require("../../models/BlogSchema");
const Image = require("../../models/ImagePostSchema");
const Video = require("../../models/VideoPostSchema");
const Quote = require("../../models/QuotePostSchema");

const DBNAME = "<dbname>";

const {
  blogSchema,
  imageSchema,
  videoSchema,
  quoteSchema,
} = require("./Schema");

const typesense = new Typesense.Client({
  nodes: [
    {
      host: "159.89.169.195",
      port: "8108",
      protocol: "http",
    },
  ],
  apiKey: "AjY8ACEDesXtXtCsyKyj0BZ0S9zT4sh9kPVme3wptwC6N3fK",
  connectionTimeoutSeconds: 10,
  numRetries: 1,
});

const watchingByTypesense = async (client) => {
  try {
    console.log("Typesense Watch Connected.");
  } catch (error) {
    console.log("error in typesense not Connected.💀");
    mytyBot("typesense is not ❌ connected.😭");
    return;
  }

  // console.log("typesense after try catch ");

  function getCollectionAndSchema(collName) {
    switch (collName) {
      case "temp_quoteposts":
        return "quote";

      case "temp_videoposts":
        return "video";

      case "temp_imageposts":
        return "image";

      case "temp_blogs":
        return "blogs";

      default:
        return null;
    }
  }

  async function index(next) {
    // console.log("indexing next", JSON.stringify(next, null, 2));
    const collection = getCollectionAndSchema(next.ns.coll);
    // console.log(' collection switch return  ------>', collection);

    if (collection) {
      // console.log(
      //   'inside if for  delete or update or insert ------>',
      //   next?.operationType
      // );
      if (next.operationType == "delete") {
        try {
          const result = await typesense
            .collections(collection)
            .documents(next.documentKey._id)
            .delete();
          console.log(
            "replica deleted",
            next.documentKey._id
            // 'result',
            // result
          );
        } catch (error) {
          console.log("Index Create Action", error);
        }
      } else if (next.operationType == "update") {
        let data = JSON.stringify(next.updateDescription.updatedFields);
        try {
          const result = await typesense
            .collections(collection)
            .documents(next.documentKey._id)
            .update(data);
          // console.log('replica updated ------> ', 'result', result);
          console.log("replica updated ------> ");
        } catch (error) {
          console.log("Index Update Action", error);
        }
      } else {
        next.fullDocument.id = next.fullDocument["_id"];
        // console.log(
        //   'next.fullDocument.user_id  ---->',
        //   next.fullDocument.user_id
        // );
        try {
          const user = await User.findOne({
            _id: next.fullDocument.user_id,
          }).select("_id subdomain name username image_url image_url_compress");
          // console.log('user ----> ', 'user', user);
          let data = JSON.stringify({
            ...next.fullDocument,
            user_id: user,
            username: user.name,
          });
          // console.log('data ----> ', data);
          const result = await typesense
            .collections(collection)
            .documents()
            .upsert(data);
          // console.log('replica inserted ------>', result);
          console.log("replica inserted ------>");
        } catch (error) {
          console.log("Index Upsert Action", error);
        }
      }
    }
  }

  // function closeChangeStream(timeInMs = 60000, changeStream) {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       console.log("Closing the change stream");
  //       changeStream.close();
  //       resolve();
  //     }, timeInMs);
  //   });
  // }

  async function monitorListingsUsingEventEmitter(client, timeInMs = 60000) {
    const collection = client.db(DBNAME);

    try {
      const changeStream = collection.watch();

      changeStream.on("change", (next) => {
        // console.log('monitor Listings Using EventEmitter');
        // console.log('next in monitor listings emitter ', next.ns);

        index(next);
      });
      // await closeChangeStream(timeInMs, changeStream);
    } catch (error) {
      console.log("typesense is not ❌ connected 😭", error.message);
    }
  }

  try {
    await monitorListingsUsingEventEmitter(client);
  } catch (e) {
    console.error("error in monitorListingsUsingEventEmitter --> ", e);
  }
  //  finally {
  //   await client.close();
  // }
};

const createBlogCollection = async () => {
  typesense.collections().create(blogSchema());

  console.log("Blog schema created ");

  const resultBlogs = await Blog.find({ drafted: false })
    .sort({ updatedAt: -1 })
    .populate("user_id", {
      name: 1,
      username: 1,
      subdomain: 1,
      image_url: 1,
      image_url_compress: 1,
    });

  console.log("fetched Blogs length", resultBlogs.length);

  if (resultBlogs.length) {
    setTimeout(() => {
      resultBlogs.forEach(async (data) => {
        let collectionsList = await typesense
          .collections("blogs")
          .documents()
          .create({
            id: data._id,
            ...data.toObject(),
          });
      });
    }, 1000);
    return true;
  }
  myty;
};

const createImageCollection = async () => {
  typesense.collections().create(imageSchema());
  console.log("image schema created ");

  const resultImage = await Image.find({ published: true })
    .sort({ updatedAt: -1 })
    .populate("images")
    .populate("user_id", {
      name: 1,
      username: 1,
      subdomain: 1,
      image_url: 1,
      image_url_compress: 1,
    });

  console.log("fetched image length", resultImage.length);

  if (resultImage.length) {
    setTimeout(() => {
      resultImage.forEach(async (data) => {
        const collectionsList = await typesense
          .collections("image")
          .documents()
          .create({
            id: data._id,
            ...data.toObject(),
            username: data.user_id.name,
          });
      });
      console.log("ImageCollection is created");
    }, 2000);
    return true;
  }
};

const createVideoCollection = async () => {
  typesense.collections().create(videoSchema());
  console.log("video Schema created ");

  const resultVideo = await Video.find({ published: true })
    .sort({ updatedAt: -1 })
    .populate("videos")
    .populate("user_id", {
      name: 1,
      username: 1,
      subdomain: 1,
      image_url: 1,
      image_url_compress: 1,
    });

  console.log("fetched video length", resultVideo.length);

  if (resultVideo.length) {
    setTimeout(() => {
      resultVideo.forEach(async (data) => {
        const collectionsList = await typesense
          .collections("video")
          .documents()
          .create({
            id: data._id,
            ...data.toObject(),
            username: data.user_id.name,
          });
      });
      console.log("VideoCollection is created");
    }, 4000);
    return true;
  }
};

const createQuoteCollection = async () => {
  typesense.collections().create(quoteSchema());
  console.log("quote Schema created ");

  const resultQuote = await Quote.find({ published: true })
    .sort({ updatedAt: -1 })
    .populate("user_id", {
      name: 1,
      username: 1,
      subdomain: 1,
      image_url: 1,
      image_url_compress: 1,
    });

  console.log("fetched quote length", resultQuote.length);

  if (resultQuote.length) {
    setTimeout(() => {
      resultQuote.forEach(async (data) => {
        // console.log("data", { id: data._id, ...data.toObject() });
        const collectionsList = await typesense
          .collections("quote")
          .documents()
          .create({
            id: data._id,
            ...data.toObject(),
            username: data.user_id.name,
          });
        // console.log("collectionsList", collectionsList);
      });
      console.log("QuoteCollection is created");
    }, 3000);
    return true;
  }
};

const queryMultiCollection = async (query, typoTolerant) => {
  let searchRequests = {
    searches: [
      {
        collection: "blogs",
        q: query,
        query_by: "title,username,user_fullname",
        query_by_weights: "2,1,1",
        typoTokensThreshold: typoTolerant ? 1 : 0,
        drop_tokens_threshold: typoTolerant ? 1 : 0,

        default_sorting_field: "updatedAt",
      },
      {
        collection: "image",
        q: query,
        query_by: "caption,username",
        query_by_weights: "2,1",
        typoTokensThreshold: typoTolerant ? 1 : 0,
        drop_tokens_threshold: typoTolerant ? 1 : 0,

        default_sorting_field: "updatedAt",
      },
      {
        collection: "video",
        q: query,
        query_by: "caption,username",
        query_by_weights: "2,1",
        typoTokensThreshold: typoTolerant ? 1 : 0,
        drop_tokens_threshold: typoTolerant ? 1 : 0,

        default_sorting_field: "updatedAt",
      },
      {
        collection: "quote",
        q: query,
        query_by: "quoted_by,quote,username",
        query_by_weights: "1,2,1",
        typoTokensThreshold: typoTolerant ? 1 : 0,
        drop_tokens_threshold: typoTolerant ? 1 : 0,

        default_sorting_field: "updatedAt",
      },
    ],
  };

  let commonSearchParams = {};

  const searchResults = await typesense.multiSearch.perform(
    searchRequests,
    commonSearchParams
  );

  let search = [];

  if (searchResults.results.length) {
    // console.log(
    //   "searchResults",
    //   searchResults,
    //   "searchResults.results.",
    //   JSON.stringify(searchResults.results, null, 2)
    // );
    searchResults.results.forEach((data) => {
      let docs = [];
      let highlights = [];
      data.hits.forEach((doc) => {
        docs.push(doc.document);

        doc.highlights.forEach((h) => {
          doc.document[h.field] = h.snippet;
          // console.log("\ndocument value", doc.document[h.field]);
          // console.log("marked value", h.snippet, "\n");
        });
      });
      search.push(...docs);
    });

    // console.log("result", JSON.stringify(search, null, 2));
    const result = {
      msg: "search successfull",
      results: { blog: search },
    };

    return result;
  }
};

const queryMultiCollectionForSuggestion = async (
  query,
  typoTolerant = false
) => {
  console.log("query hit in for suggestion");
  let searchRequests = {
    searches: [
      {
        collection: "blogs",
        q: query,
        query_by: "title,username,user_fullname",
        query_by_weights: "2,1,1",
        typoTokensThreshold: typoTolerant ? 1 : 0,
        drop_tokens_threshold: typoTolerant ? 1 : 0,

        default_sorting_field: "updatedAt",
      },
      {
        collection: "image",
        q: query,
        query_by: "caption,username",
        query_by_weights: "2,1",
        typoTokensThreshold: typoTolerant ? 1 : 0,
        drop_tokens_threshold: typoTolerant ? 1 : 0,

        default_sorting_field: "updatedAt",
      },
      {
        collection: "video",
        q: query,
        query_by: "caption,username",
        query_by_weights: "2,1",
        typoTokensThreshold: typoTolerant ? 1 : 0,
        drop_tokens_threshold: typoTolerant ? 1 : 0,

        default_sorting_field: "updatedAt",
      },
      {
        collection: "quote",
        q: query,
        query_by: "quoted_by,quote,username",
        query_by_weights: "1,2,1",
        typoTokensThreshold: typoTolerant ? 1 : 0,
        drop_tokens_threshold: typoTolerant ? 1 : 0,

        default_sorting_field: "updatedAt",
      },
    ],
  };

  let commonSearchParams = {};

  const searchResults = await typesense.multiSearch.perform(
    searchRequests,
    commonSearchParams
  );

  let search = [];

  if (searchResults.results.length) {
    searchResults.results.forEach((data) => {
      let docs = [];
      let highlights = [];
      data.hits.forEach((doc) => {
        docs.push(doc.document);

        doc.highlights.forEach((h) => {
          highlights.push(h.snippet);
          doc.document[h.field] = h.snippet;
        });
      });

      search.push(...highlights);
    });

    const result = {
      msg: "search for suggestion is  successfull",
      results: search,
    };

    return result;
  }
};

const queryImageCollection = async (collection, query, res) => {
  console.log("query in image collection");
  let searchParameters = {
    q: query,
    query_by: "caption",
    // per_page: 10,
    default_sorting_field: "updatedAt",
    highlight_full_fields: "caption",
    // groupBy: "categories",
  };
  // console.log("searchParameters", searchParameters);

  typesense
    .collections(collection)
    .documents()
    .search(searchParameters)
    .then(function (searchResults) {
      // console.log(
      //   "searchResults",
      //   searchResults,
      //   JSON.stringify(searchResults.hits, null, 2),
      //   "/////////////////"
      // );
      const search = searchResults.hits.map((data) => data.document);
      // console.log("result in search ", search);

      res.status(200).send({
        msg: "search successfull",
        results: { blog: search },
      });
    });
};

const deleteCollection = async (collection) => {
  await typesense.collections(collection).delete();
  console.log(`${collection} collection has been deleted `);
};

const retrive = async (collection) => {
  try {
    const data = await typesense.collections().retrieve();
    // const data = await typesense.collections(collection).documents();
    // console.log(
    //   `${collection} collection retrived `,
    //   JSON.stringify(data, null, 2)
    // );
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  watchingByTypesense,
  // syncTypesenseWithDatabase,
  // queryCollection,
  queryImageCollection,
  queryMultiCollection,
  queryMultiCollectionForSuggestion,
  createBlogCollection,
  createImageCollection,
  createQuoteCollection,
  createVideoCollection,
  deleteCollection,
  retrive,
};
